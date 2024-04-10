const CartModel = require('../models/carts.model.js');
const CartMongoDBDAO = require('../DAO/carts/carts.mongodDb.dao.js');

const cartDAO = new CartMongoDBDAO;

const ProductsMongoDBDAO = require('../DAO/products/products.mongoDb.dao.js');
const productDAO = new ProductsMongoDBDAO();

const TicketController = require('../controllers/ticket.controller.js');
const { jwtConfig } = require('../config/config.js');
const { getUserData } = require('../middleware/checkrole.js');
const ticketController = new TicketController();
class CartController {

  productDao;

  constructor(ps = undefined) {
    this.productDao = ps;
  }

  async generateTicket(req, res) {
    try {

      const cart = await cartDAO.getCartByID(req.params.cid, false);
      const productsOnCart = await productDAO.getProductsByID(cart.products);

      const productsToShip = [];
      let amount = 0;
      // Remove items from cart that have enough stock. Products to be shipped are stored in away.
      productsOnCart.forEach((product, index) => {

        const cartProduct = cart.products.find(f => f._id === product._id);
        if (product.stock >= cartProduct.quantity) {
          productsToShip.push(product);
          amount += cartProduct.quantity * product.price;
          const productIndex = cart.products.findIndex(cart => cart.product.toString() === product._id.toString());
          if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
          } else {
            console.error('Error deleting product from cart', product, productsOnCart);
          }
        }
      });

      cart.save();

      const stockUpdated = await productDAO.batchUpdateProductsStock(productsToShip);
      console.log(stockUpdated);

      const email = getUserData(req)?.email;
      const ticket = await ticketController.createTicket(new Date(), amount, email);
      res.send(200).json({ title: 'Compra completada exitosamente', ticket });
    } catch (error) {
      res.status(500).render('error', { title: 'Error al finalizar la compra', message: error });
    }
  }

  async getAllCarts(req, res) {
    try {
      const carts = await cartDAO.getCarts();
      res.status(200).send({ data: carts });
    } catch (error) {
      res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async getCartByID(req, res) {
    try {
      const cart = cartDAO.getCartByID(req.params.cid, req.query.populate);
      if (!cart) {
        res.status(404).send({ message: 'No cart found' });
      } else {
        res.status(200).send({ data: cart });
      }
    } catch (error) {
      res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async createCart(req, res) {
    try {
      const result = await cartDAO.createCart(req);
      if (!result) {
        res.status(400).send({ message: result.message });
      } else {
        res.status(200).send({ data: result });
      }
    } catch (error) {
      res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async addItemToCart(req, res) {
    try {
      const cart = await cartDAO.getCartByID(req.params.cid, req.query.populate);
      if (!cart) {
        res.status(404).send({ message: 'No cart found.' });
        return;
      }

      const productToAdd = await this.productDao.getProductByID(req);
      if (!productToAdd) {
        res.status(404).send({ message: 'No such product found.' });
        return;
      }

      const prodId = req.params.pid;
      const existingProductIndex = cart.products.findIndex(f => f.product.toString() === prodId.toString());
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: productToAdd._id, quantity: 1 });
      }

      const updatedCart = await cartDAO.updateCart(cart);
      res.status(200).send({ data: updatedCart });
    } catch (error) {
      res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async editProductQuantity(req, res) {
    try {
      const cart = await cartDAO.getCartByID(req.params.cid, req.query.populate);
      if (!cart) {
        res.status(404).send({ message: 'No cart found.' });
        return;
      }

      const productToAdd = await this.productDao.getProductByID(req);
      if (!productToAdd) {
        res.status(404).send({ message: 'No such product found.' });
        return;
      }

      const prodId = req.params.pid;
      const productIndex = cart.products.findIndex(f => f.product.toString() === prodId.toString());
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += req.body.quantity;
      }
      const updatedCart = await cartDAO.updateCart(cart);
      res.status(200).send({ data: updatedCart });
    } catch (error) {
      res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async editCart(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        res.status(404).send({ message: 'No cart found.' });
        return;
      }
      cart.products = req.body;
      const updatedCart = await cart.save({ new: true });
      res.status(200).send({ data: updatedCart });
    } catch (error) {
      res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async clearCart(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        res.status(404).send({ message: 'No cart found.' });
        return;
      }
      cart.products = [];
      const clearedCart = await cart.save({ new: true });
      res.status(200).send({ data: clearedCart });
    } catch (error) {
      res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async removeItemFromCart(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        res.status(404).send({ message: 'No cart found.' });
        return;
      }
      const pid = req.params.pid;
      const productToRemove = await this.productDao.findById(pid);
      if (!productToRemove) {
        res.status(404).send({ message: 'No such product found.' });
        return;
      }
      const productIndex = cart.products.findIndex(f => f.product.toString() === productToRemove._id.toString());
      if (productIndex !== -1) {
        if (cart.products[productIndex].quantity > 1) {
          cart.products[productIndex].quantity -= 1;
        } else {
          cart.products.splice(productIndex, 1);
        }
      } else {
        res.status(404).send({ message: 'Product not found' });
        return;
      }
      const updatedCart = await cart.save({ new: true });
      res.status(200).send({ data: updatedCart });
    } catch (error) {
      res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
  }
}

module.exports = CartController;

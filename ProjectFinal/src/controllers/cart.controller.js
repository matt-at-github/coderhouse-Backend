const CartModel = require('../models/carts.model.js');
const CartMongoDBDAO = require('../DAO/carts/carts.mongodDb.dao.js');

const cartDAO = new CartMongoDBDAO();

const ProductsMongoDBDAO = require('../DAO/products/products.mongoDb.dao.js');
const productDAO = new ProductsMongoDBDAO();

const TicketController = require('../controllers/ticket.controller.js');
const ticketController = new TicketController();

const { getUserData } = require('../middleware/checkrole.js');

class CartController {

  async generateTicket(req, res) {
    try {
      console.log('cart.controller', 'generateTicket', req.params);
      const cart = await cartDAO.getCartByID(req.params.cid, true);
      console.log('cart.controller', 'generateTicket', 'cart.products', cart);
      const productsOnCart = await productDAO.getProductsByID(cart.products.map(m => m.product));
      console.log('cart.controller', 'generateTicket', 'productsOnCart', productsOnCart);
      const productsToShip = [];
      let amount = 0;
      // Remove items from cart that have enough stock. Products to be shipped are stored in away.
      // eslint-disable-next-line no-unused-vars
      productsOnCart.forEach((productOnCart, index) => {

        console.log('cart.controller', 'generateTicket', 'productOnCart', productOnCart.title, productOnCart._id.toString());

        const cartProduct = cart.products.find(product => product.product._id.toString() === productOnCart._id.toString());

        if (cartProduct && productOnCart.stock >= cartProduct.quantity) {
          // If cartProduct is found and stock is greater then bought quantity,
          // calculate amount, remove from cart and prepare to ship.          
          productsToShip.push({ _id: productOnCart._id, newStock: productOnCart.stock - cartProduct.quantity });
          amount += cartProduct.quantity * productOnCart.price;
          const productIndex = cart.products.findIndex(product => product.product._id.toString() === productOnCart._id.toString());
          if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
          } else {
            console.error('Product not found in cart', productOnCart, productsOnCart);
          }
        }
      });

      if (productsToShip.length === 0) {
        return res.status(400).json({ title: 'Compra cancelada', message: 'No había productos para enviar.' });
      }
      cart.save();

      const stockUpdated = await productDAO.batchUpdateProductsStock(productsToShip);
      console.log(stockUpdated);

      const userData = getUserData(req);
      console.log('cart.controller', 'getUserData', userData);
      const ticket = await ticketController.createTicket(new Date(), amount, userData.email);
      res.status(200).json({ title: 'Compra completada exitosamente', ticket });
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

  async renderCartByID(req, res) {
    console.log('cart.controller', 'renderCartByID', req.params.cid);
    try {
      const cart = await cartDAO.getCartByID(req.params.cid, true);
      if (!cart) {
        res.status(404).send({ message: 'No cart found' });
      }
      console.log('cart.controller', 'renderCartByID', 'cart', cart);
      const products = cart.products.map(m => { return m.toObject(); });
      res.status(200).render('myCart', { products });
    } catch (error) {
      res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async getCartByID(req, res) {
    console.log('cart.controller', 'getCartByID', req.params.cid);
    try {
      const cart = await cartDAO.getCartByID(req.params.cid, true);
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
    console.log('car.controller', 'addItemToCart', req.params, req.query);
    try {
      const cartId = req.params.cid;
      const cart = await cartDAO.getCartByID(cartId, false);
      if (!cart) {
        res.status(404).send({ message: 'No cart found.' });
        return;
      }

      const productToAdd = await productDAO.getProductByID(req);
      if (!productToAdd) {
        res.status(404).send({ message: 'No such product found.' });
        return;
      }

      const prodId = req.params.pid;
      console.log('car.controller', 'addItemToCart', 'cart.products', cart.products);
      const existingProductIndex = cart.products.findIndex(f => f.product.toString() === prodId.toString());
      console.log('car.controller', 'addItemToCart', 'existingProductIndex', existingProductIndex);
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: productToAdd._id, quantity: 1 });
      }

      await cartDAO.updateCart(cart);
      res.status(200).send({ quantity: cart.products[existingProductIndex]?.quantity ?? 1 });
    } catch (error) {
      console.error(`Cart controller error -> ${error}`);
      res.status(500).send({ message: `Cart controller error -> ${error}` });
    }
  }

  async substracItemFromCart(req, res) {
    console.log('car.controller', 'substracItemToCart', req.params, req.query);
    try {
      const cartId = req.params.cid;
      const cart = await cartDAO.getCartByID(cartId, false);
      if (!cart) {
        res.status(404).send({ message: 'No cart found.' });
        return;
      }

      const productToSubstract = await productDAO.getProductByID(req);
      if (!productToSubstract) {
        res.status(404).send({ message: 'No such product found.' });
        return;
      }

      let quantity;
      const prodId = req.params.pid;
      const existingProductIndex = cart.products.findIndex(f => f.product.toString() === prodId.toString());
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity -= 1;
        quantity = cart.products[existingProductIndex].quantity;
        console.log('cart.products[existingProductIndex].quantity', cart.products[existingProductIndex].quantity);
        if (cart.products[existingProductIndex].quantity <= 0) {
          cart.products.splice(existingProductIndex, 1);
          quantity = 0;
        }
      }
      console.log('cart.products[existingProductIndex].quantity', { quantity: cart.products[existingProductIndex]?.quantity ?? 0 });

      await cartDAO.updateCart(cart);
      res.status(200).send({ quantity });
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

      const productToSubstract = await productDAO.getProductByID(req);
      if (!productToSubstract) {
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
    console.log('cart.controller', 'clearCart');
    try {
      const cartId = req.params.cid;
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        res.status(404).send({ message: 'No cart found.' });
        return;
      }
      cart.products = [];
      const newCart = await cart.save({ new: true });
      res.status(200).send(newCart);
    } catch (error) {
      res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
  }

  async removeItemFromCart(req, res) {
    try {
      console.log('cart.controller', 'removeItemFromCart');
      const cartId = req.params.cid;
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        res.status(404).send({ message: 'No cart found.' });
        return;
      }
      const productToRemove = await productDAO.getProductByID(req);
      if (!productToRemove) {
        res.status(404).send({ message: 'No such product found.' });
        return;
      }
      const productIndex = cart.products.findIndex(f => f.product.toString() === productToRemove._id.toString());
      if (productIndex !== -1) {
        cart.products.splice(productIndex, 1);
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

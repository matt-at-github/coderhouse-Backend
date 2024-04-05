const CartModel = require('../models/carts.model.js');
const CartMongoDBDAO = require('../DAO/carts/carts.mongodDb.dao.js');

const cartDAO = new CartMongoDBDAO;

class CartController {

  productDao;

  constructor(ps = undefined) {
    this.productDao = ps;
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
      const cart = cartDAO.getCart(req);
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
      const cart = await cartDAO.getCart(req);
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
      const cart = await cartDAO.getCart(req);
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

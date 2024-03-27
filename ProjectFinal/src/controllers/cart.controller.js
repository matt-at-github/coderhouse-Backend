const CartModel = require('../models/carts.model.js');
const CartMongoDBDAO = require('../DAO/carts/carts.mongodDb.dao.js');

const cartDAO = new CartMongoDBDAO;

class CartController {

  productDao;

  constructor(ps = undefined) {
    this.productDao = ps;
  }

  async getCarts() {
    try {
      const carts = await cartDAO.getCarts();
      return { code: 200, data: carts, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async getCartByID(req, res) {
    try {

      const cart = cartDAO.getCart(req);
      if (!cart) {
        return { code: 404, message: 'No cart found', success: false };
      }
      return { code: 200, data: cart, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async createCart(req) {
    try {

      const result = await cartDAO.createCart(req);
      if (!result) {
        return { code: 400, message: result.message, success: false };
      }
      return { code: 200, data: result, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async addItemToCart(req) {
    try {

      const cart = await cartDAO.getCart(req);
      if (!cart) {
        return { code: 404, message: 'No cart found.', success: false };
      }

      const productToAdd = await this.productDao.getProductByID(req);
      if (!productToAdd) {
        return { code: 404, message: 'No such product found.', success: false };
      }

      const prodId = req.params.pid;
      const existingProductIndex = cart.products.findIndex(f => f.product.toString() === prodId.toString());
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: productToAdd._id, quantity: 1 });
      }

      const updatedCart = await cartDAO.updateCart(cart);
      return { code: 200, data: updatedCart, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async editProductQuantity(req) {
    try {

      const cart = await cartDAO.getCart(req);
      if (!cart) {
        return { code: 404, message: 'No cart found.', success: false };
      }

      const productToAdd = await this.productDao.getProductByID(req);
      if (!productToAdd) {
        return { code: 404, message: 'No such product found.', success: false };
      }

      const prodId = req.params.pid;
      const productIndex = cart.products.findIndex(f => f.product.toString() === prodId.toString());
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += req.body.quantity;
      }
      const updatedCart = await cartDAO.updateCart(cart);
      return { code: 200, data: updatedCart, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async editCart(req) {
    try {
      const cartId = req.params.cid;
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        return { code: 404, message: 'No cart found.', success: false };
      }
      cart.products = req.body;
      const updatedCart = await cart.save({ new: true });
      return { code: 200, data: updatedCart, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async clearCart(req) {
    try {
      const cartId = req.params.cid;
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        return { code: 404, message: 'No cart found.', success: false };
      }
      cart.products = [];
      const clearedCart = await cart.save({ new: true });
      return { code: 200, data: clearedCart, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async removeItemFromCart(req) {
    try {
      const cartId = req.params.cid;
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        return { code: 404, message: 'No cart found.', success: false };
      }
      const pid = req.params.pid;
      const productToRemove = await this.productDao.findById(pid);
      if (!productToRemove) {
        return { code: 404, message: 'No such product found.', success: false };
      }
      const productIndex = cart.products.findIndex(f => f.product.toString() === productToRemove._id.toString());
      if (productIndex !== -1) {
        if (cart.products[productIndex].quantity > 1) {
          cart.products[productIndex].quantity -= 1;
        } else {
          cart.products.splice(productIndex, 1);
        }
      } else {
        return { code: 404, message: 'Product not found', success: false };
      }
      const updatedCart = await cart.save({ new: true });
      return { code: 200, data: updatedCart, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }
}

module.exports = CartController;

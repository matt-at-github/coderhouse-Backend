const CartModel = require('../models/carts.model.js');
// const ProductService = require('../../services/products.service.js');

class CartController {

  ProductService;

  constructor(ps = undefined) {
    this.ProductService = ps;
  }

  async getCarts() {
    try {
      const carts = await CartModel.find().populate('products.product');
      return { code: 200, data: carts, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async getCart(req) {
    try {
      const populate = req.query.populate === 'true';
      const cid = req.params.cid;
      const query = CartModel.findById(cid);
      if (populate) { query.populate('products.product'); }
      const cart = await query;
      return { code: 200, data: cart, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async createCart(req) {
    try {
      const cart = new CartModel({});
      if (req.body.productsId) {
        const productToAdd = await this.ProductService.findOne({ _id: req.body.productsId });
        cart.products.push({ product: productToAdd, quantity: 1 });
      }
      console.log('api.carts.router POST cart.id', cart); // TODO: remove
      const savedCart = await cart.save({ new: true });
      return { code: 200, data: savedCart, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async addItemToCart(req) {
    try {
      const cartId = req.params.cid;
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        return { code: 404, message: 'No cart found.', success: false };
      }
      const prodId = req.params.pid;
      const productToAdd = await this.ProductService.findOne({ _id: prodId });
      if (!productToAdd) {
        return { code: 404, message: 'No such product found.', success: false };
      }
      const existingProductIndex = cart.products.findIndex(f => f.product.toString() === prodId.toString());
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: productToAdd._id, quantity: 1 });
      }
      const updatedCart = await cart.save({ new: true });
      return { code: 200, data: updatedCart, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async editProductQuantity(req) {
    try {
      const cartId = req.params.cid;
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        return { code: 404, message: 'No cart found.', success: false };
      }
      const prodId = req.params.pid;
      const productToAdd = await this.ProductService.findOne({ _id: prodId });
      if (!productToAdd) {
        return { code: 404, message: 'No such product found.', success: false };
      }
      const productIndex = cart.products.findIndex(f => f.product.toString() === prodId.toString());
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += req.body.quantity;
      }
      const updatedCart = await cart.save({ new: true });
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
      console.log('api.carts.router DELETE product', req.params); // TODO: remove
      const cartId = req.params.cid;
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        return { code: 404, message: 'No cart found.', success: false };
      }
      const pid = req.params.pid;
      const productToRemove = await this.ProductService.findById(pid);
      if (!productToRemove) {
        return { code: 404, message: 'No such product found.', success: false };
      }
      console.log('api.carts.router DELETE cart.products', cart.products); // TODO: remove
      const productIndex = cart.products.findIndex(f => f.product.toString() === productToRemove._id.toString());
      console.log('api.carts.router DELETE product', productIndex); // TODO: remove
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

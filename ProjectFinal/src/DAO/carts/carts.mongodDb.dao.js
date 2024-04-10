const CartModel = require('../../models/carts.model');

class CartMongoDBDAO {

  async getCarts() {
    try {
      const carts = await CartModel.find().populate('products.product');
      return carts;
    } catch (error) {
      throw new Error('Error at getting carts', error);
    }
  }

  async getCartByID(cartId, populate) {
    try {
      const query = CartModel.findById(cartId);
      if (populate) { query.populate('products.product'); }
      const cart = await query;
      return cart;
    } catch (error) {
      throw new Error('Error at getting cart', error);
    }
  }

  async createCart(req) {
    try {
      const cart = new CartModel({});
      if (req.body.productsId) {
        const productToAdd = await this.ProductService.findOne({ _id: req.body.productsId });
        cart.products.push({ product: productToAdd, quantity: 1 });
      }
      const result = await cart.save({ new: true });
      return result;
    } catch (error) {
      throw new Error('Error at creating cart', error);
    }
  }

  async updateCart(cart) { // TODO: REVIEW
    try {

      // const cart = await CartModel.findById(req.params.cid);
      const updatedCart = cart.save({ new: true });
      return updatedCart;
    } catch (error) {
      throw new Error('Error at saving cart', error);
    }
  }

}

module.exports = CartMongoDBDAO;
const fs = require('fs').promises;

class CartManager {

  path;
  carts;

  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  async getCartById(id) {
    const cart = await this.#getCartById(id);
    if (!cart) { return { success: false, message: `Cart of ID ${id} does not exists.` }; }
    return { success: true, message: cart };
  }

  async createNewCart(productsId) {

    await this.#populateCarts();

    const newCart = {
      products: []
    };

    productsId.forEach(e => {
      newCart.products.push({ id: e, quantity: 1 });
    });

    this.carts.push(newCart);

    await this.#writeToDb(this.carts);
    return { success: true, message: newCart };
  }

  async addItemToCartById(cartId, productID) {

    const cart = await this.#getCartById(cartId);
    if (!cart) {
      console.error(`Cart ID ${cartId} not found. Update cancelled.`);
      return { success: false, message: `Cart ID ${cartId} not found. Update cancelled.` };
    }

    const product = cart.products.find(f => f.id === productID);
    if (product) {
      product.quantity += 1;
    } else {
      cart.products.push({ id: productID, quantity: 1 });
    }

    this.carts.splice(this.carts.findIndex(f => f.id === cartId), 1, cart);

    await this.#writeToDb(this.carts);
    return { success: true, message: cart };
  }

  async #populateCarts() {
    this.carts = await this.#readFromDb();
  }

  async #getCartById(id) {
    this.carts = await this.#readFromDb();
    CartManager.id = (this.carts.map(m => m.id)
      .sort((x, y) => y - x)
      .at(0) || 0) + 1;
    return this.carts.find(f => f.id === id);
  }

  async #writeToDb(content) {
    try {
      const fileStatus = await fs.stat(this.path);
      if (fileStatus) {
        await fs.writeFile(this.path, JSON.stringify(content, null, 2));
      }
    } catch (error) {
      console.error(`Error at Database writting: ${error}.`);
    }
  }

  async #readFromDb() {
    try {
      const fileStatus = await fs.stat(this.path);
      if (fileStatus) {
        return JSON.parse(await fs.readFile(this.path, 'utf-8'));
      }
      return [{}];
    } catch (error) {
      console.error(`Error at Database reading: ${error}.`);
    }
  }
}

module.exports = CartManager;
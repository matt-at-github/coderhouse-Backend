const fs = require('fs').promises;

class ProductManager {

  static id = 0;
  products;
  path;

  constructor(path) {
    this.path = path;
    this.products = [];
  };

  async updateProductById(id, title, description, price, thumbnail, code, stock) {

    const productToUpdate = await this.#getProductById(id)
    if (!productToUpdate) { return console.error(`Product ID ${id} not found. Update cancelled.`) }

    if (code && this.#isCodeDuplicated(code)) { return console.error(`Product code for product ID '${id}' duplicated. Product was not updated.`) };

    Object.assign(productToUpdate, {
      title: title || productToUpdate.title,
      description: description || productToUpdate.description,
      price: price || productToUpdate.price,
      thumbnail: thumbnail || productToUpdate.thumbnail,
      code: code || productToUpdate.code,
      stock: stock || productToUpdate.stock,
    });

    if (this.#replaceProduct(productToUpdate, productToUpdate)) {
      await this.#writeToDb(this.products)
      return console.log(`Product ID ${id} updated successfuly.`);
    }

    return console.error(`Product ID ${id} not updated, ID not found.`)
  }

  async deleteProductByID(id) {
    const productToDelete = await this.#getProductById(id);
    if (!productToDelete) { return console.error(`Product ID ${id} not found. Delete not done!`) }

    const productDeleted = this.#replaceProduct(productToDelete)
    if (productDeleted) {
      await this.#writeToDb(this.products)
      return console.log(`Product ID ${id} deleted succesfully.`)
    }

    return console.error(`Product ID ${id} was not deleted, ID not found.`)
  }

  async addProduct(title, description, price, thumbnail, code, stock) {

    const getUniqueID = () => { return ProductManager.id++; }

    const validateFields = () => {

      const emptyEntries = [];

      Object.entries({ title, description, price, thumbnail, code, stock })
        .forEach(([key, value]) => {
          if (value === null || value === undefined || value.toString()?.trim() === '') {
            emptyEntries.push(key);
          }
        });
      return (emptyEntries);
    }

    const invalidField = validateFields();
    if (invalidField.length > 0) { return console.error(`Fields [${invalidField.join(', ')}] empty. All fields are mandatory. Product was not added.`); }

    if (this.#isCodeDuplicated()) { return console.error(`Product code for '${title}' duplicated. Product was not added.`) };

    this.products.push({
      id: getUniqueID(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    });

    await this.#writeToDb(this.products);
    return console.log(`Product '${title}' added successfully!`);
  };

  async getProducts() {
    return await this.#readFromDb();
    return console.table(await this.#readFromDb());
  };

  async getProductById(id) {
    const product = await this.#getProductById(id)
    return product ?? undefined;
  }

  async #getProductById(id) {
    this.products = await this.#readFromDb();
    ProductManager.id = (this.products.map(m => m.id)
      .sort((x, y) => y - x)
      .at(0) || 0) + 1;
    return this.products.find(f => f.id === id)
  }

  #replaceProduct(replacee, replacement) {
    const productToReplaceIndex = this.products.indexOf(replacee);
    if (productToReplaceIndex === -1) { return false }
    if (!replacement) {
      this.products = this.products.filter(f => f.id != replacee.id);
    } else {
      this.products.splice(productToReplaceIndex, 1, replacement);
    }
    return true
  }

  #isCodeDuplicated(code) {
    return this.products.some(f => f.code === code?.trim() ?? '');
  }

  async #writeToDb(content) {
    try {
      const fileStatus = await fs.stat(this.path)
      if (fileStatus) {
        await fs.writeFile(this.path, JSON.stringify(content, null, 2));
      }
    } catch (error) {
      console.error(`Error at Database writting: ${error}.`);
    }
  }

  async #readFromDb() {
    try {
      const fileStatus = await fs.stat(this.path)
      if (fileStatus) {
        return JSON.parse(await fs.readFile(this.path, "utf-8"));
      }
      return [{}];
    } catch (error) {
      console.error(`Error at Database reading: ${error}.`);
    }
  }
};

module.exports = ProductManager;
const fs = require('fs').promises;

class ProductManager {

  static id = 0;
  products;
  path;

  constructor(path) {
    this.path = path;
    this.products = [];
  }

  async updateProductById(id, title, description, price, thumbnails, code, stock, status) {

    const productToUpdate = await this.#getProductById(id);
    if (!productToUpdate) {
      console.error(`Product ID ${id} not found. Update cancelled.`);
      return { success: false, message: `Product ID ${id} not found. Update cancelled.` };
    }

    if (code && this.#isCodeDuplicated(code)) {
      console.error(`Product code for product ID '${id}' duplicated. Product was not updated.`);
      return { success: false, message: `Product code for product ID '${id}' duplicated. Product was not updated.` };
    }

    Object.assign(productToUpdate, {
      title: title || productToUpdate.title,
      description: description || productToUpdate.description,
      price: price || productToUpdate.price,
      thumbnails: thumbnails || productToUpdate.thumbnails,
      code: code || productToUpdate.code,
      stock: stock || productToUpdate.stock,
      status: status || productToUpdate.status
    });

    if (!this.#replaceProduct(productToUpdate, productToUpdate)) {
      console.error(`Product ID ${id} not updated, ID not found.`);
      return { success: false, message: `Product ID ${id} not updated, ID not found.` };
    }

    await this.#writeToDb(this.products);
    return { success: true, message: productToUpdate };
  }

  async deleteProductByID(id) {
    const productToDelete = await this.#getProductById(id);
    if (!productToDelete) {
      console.error(`Product ID ${id} not found. Delete not done!`);
      return { success: false, message: `Product ID ${id} not found. Delete not done!` };
    }

    const productDeleted = this.#replaceProduct(productToDelete);
    if (productDeleted) {
      await this.#writeToDb(this.products);
      return { success: true, message: `Product ID ${id} deleted succesfully.` };
    }

    console.error(`Product ID ${id} was not deleted, ID not found.`);
    return { success: false, message: `Product ID ${id} was not deleted, ID not found.` };
  }

  async addProduct(title, description, price, thumbnails, code, stock, status = true) {

    await this.#populateProducts();

    const getUniqueID = () => {
      const newID = Number(this.products.at(-1)?.id ?? 0) + 1;
      return newID;
    };

    const validateFields = () => {

      const emptyEntries = [];

      Object.entries({ title, description, price, thumbnails, code, stock, status })
        .forEach(([key, value]) => {
          if (key !== 'thumbnails') {
            if (value === null || value === undefined || value.toString()?.trim() === '') {
              emptyEntries.push(key);
            }
          }
        });
      return (emptyEntries);
    };

    const invalidField = validateFields();
    if (invalidField.length > 0) {
      console.error(`Fields [${invalidField.join(', ')}] empty. All fields are mandatory. Product was not added.`);

      return { success: false, message: `Fields [${invalidField.join(', ')}] empty. All fields are mandatory. Product was not added.` };
    }

    if (this.#isCodeDuplicated(code)) {
      console.error(`Product code for '${title}' duplicated. Product was not added.`);
      return { success: false, message: `Product code for '${title}' is duplicated. Product was not added.` };
    }

    const newProduct = {
      id: getUniqueID(),
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status
    };
    this.products.push(newProduct);

    await this.#writeToDb(this.products);
    return { success: true, message: newProduct };
  }

  async getProducts() {
    await this.#populateProducts();
    return { success: true, message: this.products };
  }

  async getProductById(id) {
    const product = await this.#getProductById(id);
    if (!product) { return { success: false, message: `Product of ID ${id} does not exists.` }; }
    return { success: true, message: product };
  }

  async #populateProducts() {
    this.products = await this.#readFromDb();
  }

  async #getProductById(id) {
    this.products = await this.#readFromDb();
    ProductManager.id = (this.products.map(m => m.id)
      .sort((x, y) => y - x)
      .at(0) || 0) + 1;
    return this.products.find(f => f.id === id);
  }

  #replaceProduct(replacee, replacement) {
    const productToReplaceIndex = this.products.indexOf(replacee);
    if (productToReplaceIndex === -1) { return false; }
    if (!replacement) {
      this.products = this.products.filter(f => f.id != replacee.id);
    } else {
      this.products.splice(productToReplaceIndex, 1, replacement);
    }
    return true;
  }

  #isCodeDuplicated(code) {
    return this.products.some(f => f.code === code?.trim() ?? '');
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
        return JSON.parse(await fs.readFile(this.path, "utf-8"));
      }
      return [{}];
    } catch (error) {
      console.error(`Error at Database reading: ${error}.`);
    }
  }
}

module.exports = ProductManager;
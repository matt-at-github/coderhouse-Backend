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
    return console.table(await this.#readFromDb());
  };

  async getProductById(id) {
    const product = await this.#getProductById(id)
    return product ? console.log(product) : console.error(`Product ID ${id} not found.`);
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
      await fs.writeFile(this.path, JSON.stringify(content, null, 2));
    } catch (error) {
      console.error(`Error at Database writting: ${error}.`);
    }
  }

  async #readFromDb() {
    try {
      return JSON.parse(await fs.readFile(this.path, "utf-8"));
    } catch (error) {
      console.error(`Error at Database reading: ${error}.`);
    }
  }
};

console.group('Class init')
const dbPath = './myDatabase.json';
const productManager = new ProductManager(dbPath);
console.groupEnd()

async function tests_AddProducts() {
  console.group('Agregamos productos:');
  await productManager.addProduct('Teclado Genius Negro', 'Teclado Genius genérico negro', 10, '../productos/perifericos/teclado01.jpeg', 'tecla-1', 10);
  await productManager.addProduct('Teclado Genius Blanco', 'Teclado Genius genérico blanco', 12, '../productos/perifericos/teclado02.jpeg', 'tecla-2', 8);
  await productManager.addProduct('Teclado Genius Rosa', 'Teclado Genius genérico rosa', '', '../productos/perifericos/teclado03.jpeg', 'tecla-3', 8);
  await productManager.addProduct('Mouse Genius Blanco', 'Mouse Genius genérico blanco', 10, '../productos/perifericos/mouse01.jpeg', 'mouse-2', 8);
  await productManager.addProduct('Mouse Genius Rosa', 'Mouse Genius genérico rosa', 10, '../productos/perifericos/mouse02.jpeg', 'mouse-3', 8);
  await productManager.addProduct('Mouse Genius Negro', 'Mouse Genius genérico negro', 7, undefined, 'mouse-1', 10);
  await productManager.addProduct('Auriculares Genius negro', 'Auriculares Genius negro', 8, '../productos/perifericos/auris01.jpeg', 'auris-1', 20);
  await productManager.addProduct('Auriculares Rzer', 'Auriculares Rzer', 13, '../productos/perifericos/auris02.jpeg', 'auris-2', 12);
  console.groupEnd()

  console.group('Mostramos todos los productos');
  console.table(await productManager.getProducts());
  console.groupEnd()
}

async function tests_GetProductsByID() {
  console.group('Buscamos productos por ID:');
  
  console.group('ID 2:');
  await productManager.getProductById(2);
  console.groupEnd()
  console.group('ID 3:');
  await productManager.getProductById(3);
  console.groupEnd()
  console.group('ID 7:');
  await productManager.getProductById(7);
  console.groupEnd()
  
  console.groupEnd()
}

async function tests_EditProducts() {
  console.group('Editamos algunos productos:')
  
  console.group('Editamos producto ID 100:');
  await productManager.updateProductById(100, 'Teclado Genius Negro', 'Teclado Genius genérico negro', 10, '../productos/perifericos/teclado01.jpeg', 'tecla-1', 0) // => ID not found
  console.groupEnd()
  console.group('Editamos producto ID 100:');
  await productManager.updateProductById(2, undefined, undefined, 18, undefined, undefined, 50) // => New price and stock
  console.groupEnd()
  console.group('Editamos producto ID 100:');
  await productManager.updateProductById(3, undefined, undefined, undefined, '../productos/perifericos/mouse99.jpeg', undefined, 330) // => New picture path
  console.groupEnd()

  console.group('Mostramos todos los productos');
  console.table(await productManager.getProducts());
  console.groupEnd()

  console.groupEnd()
}

async function tests_DeleteProducts() {
  console.group('Eliminamos algunos productos por ID:')
  
  console.group('ID 100:')
  await productManager.deleteProductByID(100);
  console.groupEnd()

  console.group('ID 1:')
  await productManager.deleteProductByID(1);
  console.groupEnd()
  
  console.group('ID 4:')
  await productManager.deleteProductByID(4);
  console.groupEnd()

  console.groupEnd()

  console.group('Mostramos todos los productos');
  console.table(await productManager.getProducts());
  console.groupEnd()
}

async function tests_AddMoreProducts() {
  console.group('Agregamos mas productos:')
  await productManager.addProduct('Mic Rzer', 'Microfono Rzer', 8, '../productos/perifericos/mic01.jpeg', 'mic-1', 24);
  await productManager.addProduct('Mic Asus', 'Microfono Asus', 5, '../productos/perifericos/mic02.jpeg', 'mic-2', 14);
  console.groupEnd()

  console.group('Mostramos todos los productos');
  console.table(await productManager.getProducts());
  console.groupEnd()
}

async function runTests() {
  await tests_AddProducts();
  await tests_GetProductsByID();
  await tests_EditProducts();
  await tests_DeleteProducts();
  await tests_AddMoreProducts();
}

module.exports = { runTests };


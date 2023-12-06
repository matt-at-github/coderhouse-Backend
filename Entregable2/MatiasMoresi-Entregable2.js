const fsSync = require('fs');
// const fsPromises = require('fs').promises;

class ProductManager {

  path;
  products;
  #id;

  constructor(path) {
    this.path = path;
    this.#id = 0;
    this.products = [];
    try {
      this.initializeProductsAndMaxID()
    } catch (error) {
      return console.error(`Error while initializing ProducManager class. ${error}`);
    }
    console.log('Class initialized', ' | id:', this.#id, ' | product codes:', this.products.map(m => m.code))
    console.table(this.products)
  };

  // Since we are initializing the properties of the constructor, 
  // we use Sync methods to stop the Main Thread until the DB is fully loaded.
  initializeProductsAndMaxID() {
    try {
      const products = this.#readDatabase();
      this.products = products.filter(f => f);
      this.#id = products.map(m => m.id)
        .sort((x, y) => y - x)
        .at(0) || 0;
    } catch (error) {
      console.error(`Error while initializing Products and max ID. ${error}`);
    }
  }

  addProduct(title, description, price, thumbnail, code, stock) {

    const getUniqueID = () => {
      let newID = this.#id++;
      while (this.products.map(m => m.id).includes(newID)) {
        newID = this.#id++;
      };
      this.#id = newID
      return this.#id;
    }

    const invalidField = this.#validateProductFields(title, description, price, thumbnail, code, stock);
    if (invalidField.length > 0) { return console.error(`Field/s [${invalidField.join(', ')}] empty. All fields are mandatory. Product was not added.`); }

    if (this.#isCodeDuplicated(code)) { return console.error(`Product code for '${title}' duplicated. Product was not added.`) };

    const newProduct = {
      id: getUniqueID(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    }
    this.products.push(newProduct);

    this.#updateDatabase(this.#buildContentForDatabase())
    this.#updateProductsCache();
    return console.log(`Product '${newProduct.title}' added successfully! [${newProduct.id}]`)
  };

  getProducts() {
    return this.products;
  };

  getProductById(id) {
    const foundProduct = this.#getProductById(id);
    return foundProduct ? `Product ID ${id}: ${JSON.stringify(foundProduct)}` : `Product ID ${id} not found.`
  };

  updateProductById(id, title, description, price, thumbnail, code, stock, comment = '') {

    // console.log(`updateProductById | [${id}] ${JSON.stringify({ title, description, price, thumbnail, code, stock })}`)

    const productToUpdate = this.#getProductById(id);
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
      this.#updateDatabase(this.#buildContentForDatabase())
      this.#updateProductsCache();
      return console.log(`Product ID ${id} updated successfuly. [${comment}]`);
    }
    return console.error(`Product ID ${id} not updated, ID not found.`)
  }

  deleteProductByID(id) {
    const productToDelete = this.#getProductById(id);
    if (!productToDelete) { return console.error(`Product ID ${id} not found. Delete not done!`) }

    const productDeleted = this.#replaceProduct(productToDelete)
    if (productDeleted) {
      this.#updateDatabase(this.#buildContentForDatabase());
      this.#updateProductsCache();
      return console.log(`Product ID ${id} deleted succesfully.`)
    }

    return console.error(`Product ID ${id} was not deleted, ID not found.`)
  }

  #getProductById(id) {
    return this.products.find(f => f.id === id)
  }

  #validateProductFields(title, description, price, thumbnail, code, stock) {
    const emptyEntries = [];
    Object.entries({ title, description, price, thumbnail, code, stock })
      .forEach(([key, value]) => {
        if (value === null || value === undefined || value.toString()?.trim() === '') {
          emptyEntries.push(key);
        }
      });
    return (emptyEntries);
  }

  #isCodeDuplicated(code) {
    return this.products.some(f => f.code === code?.trim() ?? '');
  }

  #replaceProduct(toReplace, replacement) {

    const productToReplaceIndex = this.products.indexOf(toReplace);
    if (!productToReplaceIndex) { return false }
    if (!replacement) {
      this.products = this.products.filter(f => f.id != toReplace.id);
    } else {
      this.products.splice(productToReplaceIndex, 1, replacement);
    }
    return true
  }

  #updateProductsCache() {
    this.products = (this.#readDatabase());
  }

  #buildContentForDatabase() {
    return JSON.stringify(this.products, null, 2);
  }

  #updateDatabase(content) {
    try {
      fsSync.writeFileSync(this.path, content, 'utf8');
    } catch (error) {
      console.error(`Error updating the Database. ${error}`)
      return error;
    }
  };

  #readDatabase() {
    try {
      const fileExists = fsSync.existsSync(this.path);
      if (!fileExists) {
        console.log(`File ${this.path} does not exists. Creating it! (with an empty array).`)
        fsSync.writeFileSync(this.path, JSON.stringify([], null, 2), 'utf-8')
        return [];
      } else {
        const fileContent = fsSync.readFileSync(this.path, 'utf-8')
        if (fileContent.length < 1) {
          console.log('No file content!');
          return [];
        }
        return JSON.parse(fileContent);
      }
    } catch (error) {
      console.error(`Error reading the Database. ${error}`)
      return error;
    }
  };
};

console.group('Class init')
const dbPath = './myDatabase.json';
const productManager = new ProductManager(dbPath);
console.groupEnd()

function test_addProducts() {
  console.group('Agregamos productos:');
  productManager.addProduct('Teclado Genius Negro', 'Teclado Genius genérico negro', 10, '../productos/perifericos/teclado01.jpeg', 'tecla-1', 10);
  productManager.addProduct('Teclado Genius Blanco', 'Teclado Genius genérico blanco', 12, '../productos/perifericos/teclado02.jpeg', 'tecla-2', 8);
  productManager.addProduct('Teclado Genius Rosa', 'Teclado Genius genérico rosa', '', '../productos/perifericos/teclado03.jpeg', 'tecla-3', 8);
  productManager.addProduct('Mouse Genius Blanco', 'Mouse Genius genérico blanco', 10, '../productos/perifericos/mouse01.jpeg', 'mouse-2', 8);
  productManager.addProduct('Mouse Genius Rosa', 'Mouse Genius genérico rosa', 10, '../productos/perifericos/mouse02.jpeg', 'mouse-3', 8);
  productManager.addProduct('Mouse Genius Negro', 'Mouse Genius genérico negro', 7, undefined, 'mouse-1', 10);
  console.groupEnd()

  console.group('Mostramos todos los productos');
  console.table(productManager.getProducts());
  console.groupEnd()
}

function tests_getByID() {
  console.group('Buscamos productos por ID:');
  console.log(productManager.getProductById(2));
  console.log(productManager.getProductById(3));
  console.log(productManager.getProductById(7));
  console.groupEnd()
}

function tests_deleteByID() {
  console.group('Borramos algunos productos:')
  productManager.deleteProductByID(1) // => Producto code tecla-1 deleted.
  productManager.deleteProductByID(7) // => ID not found
  console.groupEnd()

  console.group('Mostramos todos los productos');
  console.table(productManager.getProducts());
  console.groupEnd()
}

function tests_addFailedProducts() {
  console.group('Agregamos productos que fallaron:');
  productManager.addProduct('Teclado ASUS Negro', 'Teclado ASUS negro iluminado', 10, '../productos/perifericos/tecladoASUS01.jpeg', 'tecla-4', 100);
  productManager.addProduct('Mouse Genius Negro', 'Mouse Genius genérico negro', 5, '../productos/perifericos/mouse07.jpeg', 'mouse-1', 10);
  console.groupEnd()

  console.group('Mostramos todos los productos');
  console.table(productManager.getProducts());
  console.groupEnd()
}

function tests_editProducts() {
  console.group('Editamos algunos productos:')

  productManager.updateProductById(100, 'Teclado Genius Negro', 'Teclado Genius genérico negro', 10, '../productos/perifericos/teclado01.jpeg', 'tecla-1', 0, 'Producto ID no exites') // => ID not found
  productManager.updateProductById(2, undefined, undefined, 18, undefined, undefined, 50, 'Cambia precio y stock') // => New price and stock
  productManager.updateProductById(3, undefined, undefined, undefined, '../productos/perifericos/mouse99.jpeg', undefined, 330, 'Cambia thumbnail y stock') // => New picture path
  console.groupEnd()

  console.group('Mostramos todos los productos');
  console.table(productManager.getProducts());
  console.groupEnd()
}

function tests_addMoreActions() {
  productManager.addProduct('Disco SSD Externo', 'Disco SSD Externo WD', 23, '../productos/perifericos/disco-01.jpeg', 'disco-1', 27);
  productManager.addProduct('Disco SSD Externo', 'Disco SSD Externo Samsung', 25, '../productos/perifericos/disco-02.jpeg', 'disco-2', 12);

  productManager.deleteProductByID(6);
  productManager.deleteProductByID(8);

  console.group('Mostramos todos los productos');
  console.table(productManager.getProducts());
  console.groupEnd()
}

test_addProducts();
tests_getByID();
tests_deleteByID();
tests_editProducts();
tests_addFailedProducts();
tests_addMoreActions();


class ProductManager {

  products;
  #id = 0;
  constructor() {
    this.products = [];
  };

  addProduct(title, description, price, thumbnail, code, stock) {

    const isCodeDuplicated = () => { return this.products.find(f => f.code === code.trim()); }
    const getUniqueID = () => { return this.#id++; }

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

    if (isCodeDuplicated()) { return console.error(`Product code for '${title}' duplicated. Product was not added.`) };

    this.products.push({
      id: getUniqueID(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    });

    return console.log(`Product '${title}' added successfully!`);
  };

  getProducts() {
    return console.table(this.products);
  };

  getProductById(id) {
    const producto = this.products.find(f => f.id === id)
    return producto ? console.log(Object.values(producto)) : console.error(`Product ID ${id} not found.`);
  }
};

const producManager = new ProductManager();

console.group('Agregamos productos:');
producManager.addProduct('Teclado Genius Negro', 'Teclado Genius genérico negro', 10, '../productos/perifericos/teclado01.jpeg', 'tecla-1', 10);
producManager.addProduct('Teclado Genius Blanco', 'Teclado Genius genérico blanco', 12, '../productos/perifericos/teclado02.jpeg', 'tecla-2', 8);
producManager.addProduct('Teclado Genius Rosa', 'Teclado Genius genérico rosa', '', '../productos/perifericos/teclado03.jpeg', 'tecla-3', 8);
producManager.addProduct('Mouse Genius Blanco', 'Mouse Genius genérico blanco', 10, '../productos/perifericos/mouse01.jpeg', 'mouse-2', 8);
producManager.addProduct('Mouse Genius Rosa', 'Mouse Genius genérico rosa', 10, '../productos/perifericos/mouse02.jpeg', 'mouse-3', 8);
producManager.addProduct('Mouse Genius Negro', 'Mouse Genius genérico negro', 7, undefined, 'mouse-1', 10);
console.groupEnd()

console.group('Buscamos productos por ID:');
producManager.getProductById(2);
producManager.getProductById(3);
producManager.getProductById(7);
console.groupEnd()

console.group('Agregamos productos que fallaron:');
producManager.addProduct('Teclado ASUS Negro', 'Teclado ASUS negro iluminado', 10, '../productos/perifericos/tecladoASUS01.jpeg', 'tecla-1', 100);
producManager.addProduct('Mouse Genius Negro', 'Mouse Genius genérico negro', 5, '../productos/perifericos/mouse07.jpeg', 'mouse-1', 10);
console.groupEnd()

console.group('Mostramos todos los productos');
producManager.getProducts();
console.groupEnd()
const { faker } = require('@faker-js/faker');

const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnails: [faker.image.urlLoremFlickr({ category: 'business' })],
    code: faker.commerce.isbn(),
    stock: faker.number.int({ min: 5, max: 50 }),
    status: true,
  };
};

module.exports = { generateProduct };
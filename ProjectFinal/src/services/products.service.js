const ProductModel = require('../models/products.model.js');

async function getProducts(queryFilter = {}, queryLimit = 10, queryPage = 1, querySort = { id: 1 }) {

  console.log('products.service getProducts queryFilter 0'); // TODO: remove

  try {

    console.log('products.service getProducts queryFilter 1', queryFilter); // TODO: remove
    const { docs, totalDocs, limit, page, totalPages, hasNextPage, nextPage, hasPrevPage, prevPage, pagingCounter } = await ProductModel.paginate(queryFilter, { limit: queryLimit, page: queryPage, sort: querySort });

    const products = docs.map(m => {
      return m.toObject();
    });

    return {
      success: products.length > 0,
      totalDocs,
      page,
      totalPages,
      limit,
      hasNextPage,
      nextPage,
      hasPrevPage,
      prevPage,
      pagingCounter,
      payload: products
    };

  } catch (error) {
    return console.log(`Product Service error -> ${error}`);
  }
}

ProductModel.getProducts = getProducts;
module.exports = ProductModel;
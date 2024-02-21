const ProductModel = require('../models/products.model.js');

async function getProducts(queryFilter = {}, queryLimit = 10, queryPage = 1, querySort = { id: 1 }) {
  try {
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
    return console.error(`Product Service error -> ${error}`);
  }
}

ProductModel.getProducts = getProducts; // TODO: Move to Controller
module.exports = ProductModel;
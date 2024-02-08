const ProductModel = require('../models/products.model.js'); // Adjust the path accordingly

async function getProducts(queryFilter = {}, queryLimit = 10, queryPage = 1, querySort = { id: 1 }) {

  try {

    const { docs, totalDocs, limit, page, totalPages, hasNextPage, nextPage, hasPrevPage, prevPage, pagingCounter } = await ProductModel.paginate(queryFilter, { limit: queryLimit, page: queryPage, sort: querySort });

    const products = docs.map(m => {
      // eslint-disable-next-line no-unused-vars
      const { _id, ...rest } = m.toObject();
      return rest;
    });

    return {
      status: 'success',
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
    throw console.log(`Product Service error -> ${error}`);
  }
}
ProductModel.getProducts = getProducts;
module.exports = ProductModel;
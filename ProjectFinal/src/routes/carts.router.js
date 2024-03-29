const express = require('express');
const router = express.Router();

const ProductsMongoDBDAO = require('../DAO/products/products.mongoDb.dao.js');
const productDAO = new ProductsMongoDBDAO();

const CartController = require('../controllers/cart.controller.js');
const cartController = new CartController(productDAO);

// Get cart by ID
// router.get('/:cid', cartController.getCartByID); // TODO

router.get('/:cid', async (req, res) => {

  try {
    req.query.populate = 'true';
    const response = await cartController.getCartByID(req);
    if (!response.success) {
      return res.status(response.code).send({ message: response.message });
    }

    return res.render('cart', {
      products: response.data.products.map(m => m.toObject()),
      totalDocs: response.data.totalDocs,
      page: response.data.page,
      totalPages: response.data.totalPages,
      limit: response.data.limit,
      hasNextPage: response.data.hasNextPage,
      nextPage: response.data.nextPage,
      hasPrevPage: response.data.hasPrevPage,
      prevPage: response.data.prevPage,
      pagingCounter: response.data.pagingCounter,
      session: req.session
    });
  } catch (error) {
    return res.status(500).send({ message: error.message || 'Internal Server Error' });
  }
});

module.exports = router;
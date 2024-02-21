const express = require('express');
const router = express.Router();

const ProductService = require('../services/products.service.js');

const CartController = require('../controllers/cart.controller.js');
const cartController = new CartController();

// Get cart by ID
router.get("/:cid", async (req, res) => {

  req.query.populate = 'true';
  const result = await cartController.getCart(req);
  if (!result.success) {
    return res.status(result.code).send({ message: result.message });
  }

  console.log('cart.router GET /:pid 0', result.data.products.map(m => m.product._id)); // TODO: remove

  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const filter = { _id: { $in: result.data.products.map(m => m.product._id) } }; // filter the products of the cart
  const sort = undefined;

  const response = await ProductService.getProducts(filter, limit, page, sort);

  res.render('cart', {
    products: response.payload,
    totalDocs: response.totalDocs,
    page: response.page,
    totalPages: response.totalPages,
    limit: response.limit,
    hasNextPage: response.hasNextPage,
    nextPage: response.nextPage,
    hasPrevPage: response.hasPrevPage,
    prevPage: response.prevPage,
    pagingCounter: response.pagingCounter,
    session: req.session
  });
});

module.exports = router;
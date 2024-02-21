const express = require('express');
const router = express.Router();

const CartModel = require('../models/carts.model.js');
const ProductService = require('../services/products.service.js');

// Get cart by ID
router.get("/:cid", async (req, res) => {

  const populate = true;
  const cid = req.params.cid;
  console.log('cart.router GET /:pid 0', cid); // TODO: remove

  const query = CartModel.findById(cid);
  if (populate) { query.populate('products.product'); }
  const cart = await query;

  if (!cart) { return res.status(400).send('No cart found.'); }

  console.log('cart.router GET /:pid 0', cart.products.map(m => m.product._id)); // TODO: remove

  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const filter = { _id: { $in: cart.products.map(m => m.product._id) } }; // filter the products of the cart
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
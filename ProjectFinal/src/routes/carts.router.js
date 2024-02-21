const express = require('express');
const router = express.Router();

const CartController = require('../controllers/cart.controller.js');
const cartController = new CartController();

// Get cart by ID
router.get("/:cid", async (req, res) => {

  try {
    req.query.populate = 'true';
    const response = await cartController.getCart(req);
    if (!response.success) {
      return res.status(response.code).send({ message: response.message });
    }

    console.log('cart.router GET /:pid 0', response.data.products.map(m => m.product._id)); // TODO: remove

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
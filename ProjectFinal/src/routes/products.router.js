const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product.controller.js');
const productController = new ProductController();

// Get all products / Get Products by query
router.get("/", async (req, res) => {

  try {
    if (!req.session.login) { return res.redirect('/users/login'); }

    const response = (await productController.getProducts(req)).data;
    if (!response.success) {
      return res.status(response.code).send({ message: response.message });
    }

    return res.render('products', {
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
  }
  catch (error) {
    res.status(500).send('Error');
  }
});

// Get product by ID
router.get("/:pid", async (req, res) => {
  try {
    const response = await productController.getProductByID(req.params.pid);
    if (!response.success) {
      return res.status(response.code).render('logout', { message: response.message });
    }

    const product = response.data;
    return res.render('product', {
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      session: req.session
    });

  } catch (error) {
    res.status(500).send(error.message || 'Internal Server Error');
  }

});

module.exports = router;
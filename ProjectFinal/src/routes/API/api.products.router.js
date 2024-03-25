const express = require('express');
const router = express.Router();

const ProductController = require('../../controllers/product.controller.js');
const productController = new ProductController();

// Get all products / Get Products by query
router.get('/', productController.getProducts);
// router.get('/', async (req, res) => {
//   try {
//     console.log('api.products.router GET', req.query);
//     const result = await productController.getProducts(req);
//     handleResponse(res, result);
//   } catch (error) {
//     res.status(500).send(error.message || 'Internal Server Error');
//   }
// });

// Get product by ID
router.get('/:pid', async (req, res) => {
  try {
    const response = await productController.getProductByID(req.params.pid);
    handleResponse(res, response);
  } catch (error) {
    res.status(500).send(error.message || 'Internal Server Error');
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const response = await productController.createProduct(req);
    handleResponse(res, response);
  } catch (error) {
    res.status(500).send(error.message || 'Internal Server Error');
  }
});

// Edit product
router.put('/:pid', async (req, res) => {
  try {
    const response = await productController.editProduct(req);
    handleResponse(res, response);
  } catch (error) {
    res.status(500).send(error.message || 'Internal Server Error');
  }
});

// Delete product
router.delete('/:pid', async (req, res) => {
  try {
    const response = await productController.deleteProduct(req);
    handleResponse(res, response);
  } catch (error) {
    res.status(500).send(error.message || 'Internal Server Error');
  }
});

module.exports = router;

// Auxiliary methods
// Helper function for response.
const handleResponse = (res, result) => {
  if (result.success) {
    res.status(result.code).send(result.data);
  } else {
    res.status(result.code).send({ message: result.message });
  }
};
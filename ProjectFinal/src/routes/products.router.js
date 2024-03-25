const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product.controller.js');
const productController = new ProductController();

// // Get all products / Get Products by query
router.get('/', productController.getProducts);

// Get product by ID
router.get('/:pid', productController.getProductByID);

module.exports = router;
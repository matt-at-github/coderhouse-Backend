const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product.controller.js');
const productController = new ProductController();

router.get('/mockingproducts', productController.renderMockedProducts.bind(productController));

// // Get all products / Get Products by query
router.get('/', productController.renderProducts);

// Get product by ID
router.get('/:pid', productController.renderProductByID);

module.exports = router;
const express = require('express');
const router = express.Router();

const ProductController = require('../../controllers/product.controller.js');
const authenticateRole = require('../../middleware/checkrole.js');
const productController = new ProductController();

// Get all products / Get Products by query
router.get('/', productController.getProducts);

// Get product by ID
router.get('/:pid', productController.getProductByID);

// Create new product
router.post('/', authenticateRole(['admin']), productController.createProduct);

// Edit product
router.put('/:pid', authenticateRole(['admin']), productController.editProduct);

// Delete product
router.delete('/:pid', authenticateRole(['admin']), productController.deleteProduct);

module.exports = router;

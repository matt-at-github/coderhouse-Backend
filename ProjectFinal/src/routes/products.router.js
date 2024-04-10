const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product.controller.js');
const productController = new ProductController();

/*
 * La única observación que puedo marcarte es que en el archivo products.router.js 
 * falta incluir los endpoints que realizan las 
 * solicitudes POST, PUT y DELETE asociadas a las productos.
 * Estos endpoints no podrán faltar en la 3ra preentrega. 
 * 
 * Federico: Estos endpoints se encuentran en ProjectFinal\src\routes\API\api.products.router.js
 * De ser necesario que esten todos en el mismo router los muevo, pero quería tener los endpoints separados.
 */

// // Get all products / Get Products by query
router.get('/', productController.renderProducts);

// Get product by ID
router.get('/:pid', productController.renderProductByID);

module.exports = router;
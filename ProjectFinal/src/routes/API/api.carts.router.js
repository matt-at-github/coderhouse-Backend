// const express = require('express');
// const router = express.Router();

// const ProductsMongoDBDAO = require('../../DAO/products/products.mongoDb.dao.js');
// const productDAO = new ProductsMongoDBDAO();

// const CartController = require('../../controllers/cart.controller.js');
// const cartController = new CartController(productDAO);

// // Get all carts
// router.get('/', async (req, res) => {
//   try {
//     const result = await cartController.getCarts();
//     handleResponse(res, result);
//   } catch (error) {
//     res.status(500).send(error.message || 'Internal Server Error');
//   }
// });

// // Get cart by ID
// router.get('/:cid', async (req, res) => {
//   try {
//     const result = await cartController.getCartByID(req);
//     handleResponse(res, result);
//   } catch (error) {
//     res.status(500).send(error.message || 'Internal Server Error');
//   }
// });

// // Create new cart.
// router.post('/', async (req, res) => {
//   try {
//     const result = await cartController.createCart(req);
//     handleResponse(res, result);
//   } catch (error) {
//     res.status(500).send(error.message || 'Internal Server Error');
//   }
// });

// // Add item to cart
// router.post('/:cid/product/:pid', async (req, res) => {
//   try {
//     const result = await cartController.addItemToCart(req);
//     handleResponse(res, result);
//   } catch (error) {
//     res.status(error.code || 500).send(error.message || 'Internal Server Error');
//   }
// });

// // PUT - Edit cart's product quantity
// router.put('/:cid/products/:pid', async (req, res) => {
//   try {
//     const result = await cartController.editProductQuantity(req);
//     handleResponse(res, result);
//   } catch (error) {
//     res.status(500).send(error.message || 'Internal Server Error');
//   }
// });

// // PUT - Edit cart
// router.put('/:cid', async (req, res) => {
//   try {
//     const result = await cartController.editCart(req);
//     handleResponse(res, result);
//   } catch (error) {
//     res.status(500).send(error.message || 'Internal Server Error');
//   }
// });

// // DELETE - Clear cart
// router.delete('/:cid', async (req, res) => {
//   try {
//     const result = await cartController.clearCart(req);
//     handleResponse(res, result);
//   } catch (error) {
//     res.status(500).send(error.message || 'Internal Server Error');
//   }
// });

// // DELETE - Remove item from cart
// router.delete('/:cid/product/:pid', async (req, res) => {
//   try {
//     const result = await cartController.removeItemFromCart(req);
//     handleResponse(res, result);
//   } catch (error) {
//     res.status(500).send(error.message || 'Internal Server Error');
//   }
// });

// module.exports = router;

// // Auxiliary methods
// // Helper function for response.
// const handleResponse = (res, result) => {
//   if (result.success) {
//     res.status(result.code).send(result.data);
//   } else {
//     res.status(result.code).send({ message: result.message });
//   }
// };
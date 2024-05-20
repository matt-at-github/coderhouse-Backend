const express = require('express');
const router = express.Router();
const CartController = require('../../controllers/cart.controller.js');
const { authenticateRole } = require('../../middleware/checkrole.js');
const cartController = new CartController();

// Get cart by ID
router.get('/:cid', cartController.getCartByID);

// Add item to cart
router.post('/:cid/products/:pid', authenticateRole(['user', 'premium']),  cartController.addItemToCart);

// Clear cart
router.delete('/:cid', cartController.clearCart);

module.exports = router;

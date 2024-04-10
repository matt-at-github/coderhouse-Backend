const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller.js');
const { authenticateRole } = require('../middleware/checkrole.js');
const cartController = new CartController();

// Get all carts
router.get('/', cartController.getAllCarts);

// Get cart by ID
router.get('/:cid', cartController.renderCartByID);

// Get cart by ID
router.get('/:cid/purchase', cartController.generateTicket);

// Create new cart
router.post('/', cartController.createCart);

// Add item to cart
router.post('/:cid/products/:pid', authenticateRole(['user']), cartController.addItemToCart);
// Edit cart's product quantity
router.post('/:cid/products/:pid/substract', authenticateRole(['user']), cartController.substracItemFromCart);

// Edit cart's product quantity
router.put('/:cid/products/:pid', authenticateRole(['user']), cartController.editProductQuantity);

// Edit cart
router.put('/:cid', cartController.editCart);

// Clear cart
router.delete('/:cid', cartController.clearCart);

// Remove item from cart
router.delete('/:cid/products/:pid', cartController.removeItemFromCart);

module.exports = router;

const express = require('express');
const router = express.Router();
// const passport = require('passport');
const userController = require('../controllers/user.controller');

// Import your custom middleware
const { authenticateUser } = require('../middleware/auth.middleware');

// User registration route
router.post('/register', userController.registerUser);

// Update user profile route
router.put('/update-profile', authenticateUser, userController.updateUserProfile);
// router.put('/profile', passport.authenticate('jwt', { session: false }), userController.updateUserProfile);

module.exports = router;

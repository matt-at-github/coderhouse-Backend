const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller.js');
const userController = new UserController();

// Create new Account
router.post('/createAccount', userController.createUser);

module.exports = router;
const express = require('express');
const router = express.Router();

const UserController = require('../../controllers/user.controller.js');
const userController = new UserController();

router.post('/createAccount', userController.createUser);

router.post('/premium/:uid', userController.changeUserRole);

module.exports = router;
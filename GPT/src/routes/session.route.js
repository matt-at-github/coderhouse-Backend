// src/routes/session.route.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const sessionController = require('../controllers/session.controller');

// User login route
router.post('/login', sessionController.loginUser);

module.exports = router;
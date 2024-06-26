const express = require('express');
const { jwtConfig } = require('../config/config');
const router = express.Router();

// router.use('/products');
// router.use('/carts');

// Sessions
// Login view
router.get('/users/login', (req, res) => {
  res.status(200).render('login');
});
// Failed login result
router.get('/users/failedLogin', async (req, res) => {
  return res.status(400).render('logout', { error: true, message: 'Ups, error de estrategía de inicio de sesión.' });
});

// Users
// Crear cuenta
router.get('/users/createAccount', (req, res) => {
  if (req.cookies[jwtConfig.tokenName]) { return res.status(200).redirect('/'); } // TODO: Cambiar a Profile Settings
  return res.status(200).render('createAccount');
});

// Account view
router.get('/users/account', (req, res) => {
  res.status(200).render('editAccount', { message: req.session });
});

module.exports = router;
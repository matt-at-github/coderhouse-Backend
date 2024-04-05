const express = require('express');
const router = express.Router();

// router.use('/products');
// router.use('/carts');

// Sessions
// Login view
router.get('/sessions/login', (req, res) => {
  res.status(200).render('login');
});
// Failed login result
router.get('/sessions/failedLogin', async (req, res) => {
  return res.status(400).render('logout', { error: true, message: 'Ups, error de estrategía de inicio de sesión.' });
});

// Users
// Crear cuenta
router.get('/users/createAccount', (req, res) => {
  if (req.session.login) { return res.status(200).redirect('/'); } // TODO: Cambiar a Profile Settings
  return res.status(200).render('createAccount');
});
// Account view
router.get('/users/logout', (req, res) => {
  res.status(200).render('logout');
});

// Account view
router.get('/users/account', (req, res) => {
  res.status(200).render('editAccount', { message: req.session });
});

// Chat
// Show chat
router.get('/chat/', (req, res) => {
  try {
    // Sokect.io it is used on this view.
    res.status(200).render('chat', { session: req.session });
  } catch (error) {
    return res.status(500).send({ message: error.message || 'Internal Server Error' });
  }
});

module.exports = router;
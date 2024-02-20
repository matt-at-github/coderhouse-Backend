const express = require("express");
const router = express.Router();

// Crear cuenta
router.get('/createAccount', (req, res) => {
  res.status(200).render('createAccount');
});

// Login view
router.get("/login", (req, res) => {
  res.status(200).render('login');
});

// Account view
router.get("/account", (req, res) => {
  res.status(200).send({ message: req.session });
});

module.exports = router;
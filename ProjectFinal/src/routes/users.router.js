const express = require("express");
const router = express.Router();

const SessionController = require('../controllers/session.controller.js');
const sessionController = new SessionController();

const UserController = require('../controllers/user.controller.js');
const userController = new UserController();

// Crear cuenta
router.get('/createAccount', (req, res) => {
  console.log('GET createAccount', req.session);
  if (req.session.login) { return res.status(200).redirect('/products'); }
  return res.status(200).render('createAccount');
});

// Create new Account
router.post('/createAccount', async (req, res) => {
  try {
    const response = await userController.createUser(req);
    console.log('response', response);
    if (!response.success) {
      return res.status(response.code).render('logout', { title: 'Crear cuenta', message: response.message });
    }

    const result = await sessionController.login(req);
    console.log('result', result);
    if (!result.sucess) {
      return res.status(response.code).send({ message: response.message });
    }
    console.log('redirecting...');
    return res.status(result.code).redirect('/products');
  } catch (error) {
    res.status(500).send({ error: "Error al crear el usuario", message: error });
  }
});

// Login view
router.get("/login", (req, res) => {
  res.status(200).render('login');
});

// Account view
router.get("/logout", (req, res) => {
  res.status(200).render('logout');
});

// Account view
router.get("/account", (req, res) => {
  res.status(200).send({ message: req.session });
});

module.exports = router;
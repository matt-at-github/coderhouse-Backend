const express = require('express');
const router = express.Router();

const passport = require('passport');

const SessionController = require('../controllers/session.controller.js');
const sessionController = new SessionController(passport);

const UserController = require('../controllers/user.controller.js');
const userController = new UserController();

// Create new Account
router.post('/createAccount', async (req, res) => {
  try {
    const response = await userController.createUser(req);
    if (!response.success) {
      return res.status(response.code).render('logout', { title: 'Crear cuenta', message: response.message });
    }

    const result = await sessionController.authenticate(req);
    if (!result.success) {
      return res.status(result.code).send({ message: result.message });
    }

    sessionController.login(req, req.user);

    return res.status(result.code).redirect('/');
  } catch (error) {
    res.status(500).send({ error: 'Error al crear el usuario', message: error });
  }
});

// PASSPORT Create new Account:
router.post('/passport/createAccount',
  passport.authenticate('register', { failureRedirect: '/failedRegister' }),
  // passport.authenticate('login', { failureRedirect: '/failedLogin' }),
  async (req, res) => {

    console.log('user/passport/createaCcount', req);
    if (!req.user) {
      return res.status(400).send({ status: 'error', message: 'Credenciales invalidas' });
    }

    const result = await sessionController.authenticate(req);
    if (!result.success) {
      return res.status(result.code).send({ message: result.message });
    }

    sessionController.login(req, req.user);

    return res.status(200).redirect('/');
  }
);

module.exports = router;
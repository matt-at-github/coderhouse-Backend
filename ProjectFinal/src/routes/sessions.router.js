const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { passportCall, authorization } = require('./utils/util.js');

const passport = require('passport');

const SessionController = require('../controllers/session.controller.js');
const sessionController = new SessionController(passport);

router.get('/current',
  passportCall('jwt'),
  authorization('user'), (req, res) => {
    res.status(200).render('logout', { title: 'Sesión Actual', message: JSON.stringify(req.user, null, 2), error: false });
  }
);

// Logout 
router.get('/logout', (req, res) => {
  try {
    const result = sessionController.logout(req);
    if (!result.success) {
      return res.status(result.code).render('logout', { error: true, title: 'Iniciar sesión', message: result.description });
    }
    return res.status(result.code).redirect('../../sessions/login');
  } catch (error) {
    res.status(500).render('logout', { title: 'Cerrar sesión', message: 'Ocurrió un problema al cerrar la sesión.' });
  }
});

//// PASSPORT
// Login with Local
router.post('/login',
  passport.authenticate('login', { failureRedirect: '/sessions/failedLogin' }),
  async (req, res) => {

    if (!req.user) {
      return res.status(400).send({ status: 'error', message: 'Credenciales invalidas' });
    }

    const result = await sessionController.authenticate(req, req.user);
    sessionController.login(req, req.user);

    let { usuario, pass } = req.body;
    let token = jwt.sign({ usuario, pass, role: 'user' }, 'coderhouse', { expiresIn: '24h' });
    res.cookie('coderCookieToken', token, { maxAge: 60 * 60 * 1000, httpOnly: true });

    return res.status(result.code).redirect('/');
  }
);

// Login with GitHub
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  // eslint-disable-next-line no-unused-vars
  async (req, res) => { }
);

// GitHub callback
router.get('/githubcallback',
  passport.authenticate('github', { failureRedirect: '/sessions/failedLogin' }),
  async (req, res) => {

    if (!req.user) {
      return res.status(400).send({ status: 'error', message: 'Credenciales invalidas' });
    }

    const result = await sessionController.authenticate(req, req.user);
    if (!result.success) {
      return res.status(result.code).send({ message: result.message });
    }

    sessionController.login(req, req.user);

    return res.status(result.code).redirect('/');
  }
);

module.exports = router;
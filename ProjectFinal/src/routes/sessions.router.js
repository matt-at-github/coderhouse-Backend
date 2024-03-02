const express = require('express');
const router = express.Router();

const passport = require('passport');

const SessionController = require('../controllers/session.controller.js');
const sessionController = new SessionController(passport);

// Login view
router.get('/login', (req, res) => {
  res.status(200).render('login');
});

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
    sessionController.login(req, req.user); sessionController.login(req, req.user);

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

// Failed login result
router.get('/failedLogin', async (req, res) => {
  return res.status(400).render('logout', { error: true, message: 'Ups, error de estrategía de inicio de sesión.' });
});

module.exports = router;
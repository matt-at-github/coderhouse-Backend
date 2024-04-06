const express = require('express');
const router = express.Router();

const { passportCall, authorization } = require('./utils/util.js');

const passport = require('passport');

const SessionController = require('../controllers/session.controller.js');
const sessionController = new SessionController(passport);

router.get('/current',
  passportCall('jwt'),
  authorization('user'),
  sessionController.getCurrentData
);

// Logout 
router.get('/logout', sessionController.logout);

//// PASSPORT
// Login with Local
router.post('/login',
  passport.authenticate('login', { failureRedirect: '/sessions/failedLogin' }),
  sessionController.authenticate
);

// Login with GitHub
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] }),
);

// GitHub callback
router.get('/githubcallback',
  passport.authenticate('github', { failureRedirect: '/sessions/failedLogin' }),
  (req, res) => { sessionController.authenticate(req, res); }
);

module.exports = router;
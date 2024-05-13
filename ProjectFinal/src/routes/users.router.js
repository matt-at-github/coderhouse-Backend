const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller.js');
const userController = new UserController();

const passport = require('passport');
const { authenticateRole } = require('../middleware/checkrole.js');

// Create new Account
router.post('/createAccount', userController.renderCreateUser);

router.post('/login', userController.login);

router.get('/recoverPassword', userController.renderRecoverPassword);
router.post('/recoverPassword', userController.recoverPassword);

// TODO: Rework!!
// // Login with GitHub
// router.get('/github',
//   passport.authenticate('github', { scope: ['user:email'] }),
// );
// // GitHub callback
// router.get('/githubcallback',
//   passport.authenticate('github', { failureRedirect: '/users/failedLogin' }),
//   userController.login
// );

router.get('/current',
  authenticateRole(['user']),
  // passport.authenticate('jwt', { session: false }), // TODO: SOLVE
  userController.getCurrent);

router.get('/logout', userController.logout);
module.exports = router;
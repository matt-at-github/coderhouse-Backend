const passport = require('passport');

function authMiddleware(req, res, next) {
  console.log('Auth middleware');
  passport.authenticate('jwt', { session: true, failureRedirect: '/users/login' }, (err, user, info) => {
    console.log('auth', 'authMiddleware', 'error', err, 'user', user);
    if (err) {
      return next(err);
    }
    if (!user) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  })(req, res, next);
}

module.exports = authMiddleware;

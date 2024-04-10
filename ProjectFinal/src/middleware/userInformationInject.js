const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/config');

// Middleware to extract user information from JWT payload
function extractUserInfo(req, res, next) {
  const token = req.cookies[jwtConfig.tokenName];
  if (token) {
    jwt.verify(token, jwtConfig.secretOrKey, (err, decoded) => {
      if (!err) { res.locals = { user: decoded.user }; }
      console.log('userInformationInject', 'decoded.user', decoded.user);
    });
  }
  next();
}

module.exports = extractUserInfo;
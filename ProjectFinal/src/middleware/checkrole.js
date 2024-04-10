const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/config');

const authenticateRole = (allowedRoles) => (req, res, next) => {

  const token = req.cookies[jwtConfig.tokenName];
  if (token) {
    jwt.verify(token, jwtConfig.secretOrKey, (err, decoded) => {
      if (err) {
        res.status(403).render('error', { title: 'Acceso denegado', message: 'Token inválido.' });
      } else {
        const userRole = decoded.user.role;
        if (allowedRoles.includes(userRole)) {
          next();
        } else {
          res.status(403).render('error', { title: 'Acceso denegado', message: 'No tienes permiso para acceder a esta página.' });
        }
      }
    });
  } else {
    res.status(403).render('error', { title: 'Acceso denegado', message: 'No tienes permiso para acceder a esta página.' });
  }
};

const getUserData = (req) => {
  console.log('checkrole', 'getUserdata');
  const token = req.cookies[jwtConfig.tokenName];
  if (token) {
    return jwt.verify(token, jwtConfig.secretOrKey, (err, decoded) => {
      return err ? null : decoded.user;
    });
  }
};

module.exports = { authenticateRole, getUserData };
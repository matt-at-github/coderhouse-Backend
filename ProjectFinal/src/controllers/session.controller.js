const UserModel = require('../models/users.model');
const { isValidPassword } = require('../utils/hashBcrypt.js');
const { jwtConfig } = require('../config/config.js');
const jwt = require('jsonwebtoken');

const UserDTO = require('../DTO/user.dto.js');
class SessionController {

  passport;

  constructor(passport) {
    this.passport = passport;
  }

  async login(req, user) {

    req.session.login = true;
    req.session.userName = `${user.first_name} ${user.last_name}`;
    req.session.isAdmin = user.role === 'admin'; // TODO: Improve
    req.session.cartId = user.cart.toString();

    req.logger.debug('session.controller.js', 'login', 'req.session.cartId', req.session.cartId);
    return { success: true, user, description: '', code: 200 };
  }

  async authenticate(req, res) {

    try {
      let user = req.user;
      if (!user) {
        const { email, password } = req.body;
        user = new UserModel();
        if (email === 'adminCoder@coder.com') {

          if (password === 'adminCod3r123') {
            user.first_name = email;
            user.last_name = '';
            user.role = 'admin';
          } else {
            return { success: false, message: 'Contraseña incorrecta.', code: 401 };
          }
        } else {

          user = await UserModel.findOne({ email: email });
          if (!user) {
            return { success: false, message: 'Usuario no encontrado.', code: 404 };
          }
          if (!isValidPassword(password, user)) {
            return { success: false, message: 'Contraseña incorrecta.', code: 401 };
          }
        }
      }

      req.session.login = true;
      req.session.userName = `${user.first_name} ${user.last_name}`;
      req.session.isAdmin = user.role === 'admin'; // TODO: Improve
      req.session.cartId = user.cart.toString();

      req.logger.debug('session.controller.js', 'authenticate', 'user', user);
      req.logger.debug('session.controller.js', 'authenticate', 'req.session.cartId', req.session.cartId);
      req.logger.debug('session.controller.js', 'authenticate', 'user.cart.toString()', user.cart.toString());

      let token = jwt.sign({ name: user.first_name, password: user.password, role: user.role }, jwtConfig.secretOrKey, { expiresIn: jwtConfig.tokenLife });
      res.cookie(jwtConfig.tokenName, token, { maxAge: 60 * 60 * 1000, httpOnly: true });

      return res.status(200).redirect('/');

    } catch (error) {
      return console.error(`Session Service error -> ${error}`);
    }
  }

}

module.exports = SessionController;
const UserModel = require('../models/users.model.js');
const UserMongoDBDAO = require('../DAO/users/users.mongoDb.dao.js');
const userDAO = new UserMongoDBDAO();

const UserDTO = require('../DTO/user.dto.js');

const jwt = require('jsonwebtoken');

const { isValidPassword } = require('../utils/hashBcrypt.js');
const { jwtConfig, cookieParserConfig } = require('../config/config.js');

async function createUser(req) {
  try {
    const exists = await userDAO.getUserByEmail(req.body.email);
    if (exists) {
      return { code: 401, error: true, message: 'El mail ya está registrado' };
    }

    const user = await userDAO.createUser(req);
    if (!user) {
      return { code: 400, error: true, message: 'Error al crear usuario' };
    }

    return user;
  } catch (error) {
    return { code: 500, error: true, message: `User controller error -> ${error}.` };
  }
}

class UserController {

  async createUser(req, res) {
    try {
      const user = await createUser(req);
      if (user.error) {
        return res.status(user.code).json({ message: user.message });
      }
      const isAdmin = user.role === 'admin';
      const userDTO = new UserDTO(user);
      let token = jwt.sign({ user: userDTO, isAdmin }, jwtConfig.secretOrKey, { expiresIn: jwtConfig.tokenLife });
      res.cookie(jwtConfig.tokenName, token, { maxAge: cookieParserConfig.life_span, httpOnly: true });
      res.locals.user = userDTO;
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ message: `User controller error -> ${error}.` });
    }
  }

  async renderCreateUser(req, res) {

    try {
      console.log('user.controller', 'renderCreateUser');
      const user = await createUser(req);
      if (user.error) {
        return res.status(user.code).json({ message: user.message });
      }
      const isAdmin = user.role === 'admin';
      const userDTO = new UserDTO(user);
      let token = jwt.sign({ user: userDTO, isAdmin }, jwtConfig.secretOrKey, { expiresIn: jwtConfig.tokenLife });
      res.cookie(jwtConfig.tokenName, token, { maxAge: cookieParserConfig.life_span, httpOnly: true });
      res.locals.user = userDTO;
      return res.status(200).redirect('/');
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async createGithubUser(profile) {

    try {
      const githubData = profile._json;
      if (githubData.email) {
        const exists = await userDAO.getUserByEmail(githubData.email);
        if (exists) {
          return { code: 400, message: 'El email está siendo usado', success: false };
        }
      }

      if (profile.username) {
        const exists = await userDAO.getUserByEmail(profile.username);
        if (exists) {
          return { code: 400, message: 'El email está siendo usado', success: false, user: exists };
        }
      }

      const body = {};

      const fullName = githubData.name?.split(' ');
      body.first_name = fullName[0] ?? '';
      body.last_name = fullName[1] ?? '';
      body.email = githubData.email ?? profile.username ?? '';
      body.age = Number(githubData.age ?? 0);
      body.password = githubData.password ?? '';

      const req = { body };

      console.log('user.controller', 'body', req);
      const response = await userDAO.createUser(req);
      if (!response) {
        return { code: 400, message: response.message, success: false };
      }
      return { code: 200, user: response, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }

  }

  async findUserById(id) {
    try {
      console.log('user.controller', 'findUserById', id);
      const user = await userDAO.getUserByID(id);
      if (!user) { return { code: 400, message: 'Usuario no encontrado', success: false }; }
      return { code: 200, user, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async login(req, res) {

    console.log('user.controller', 'login', 'req.body', req.body);
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
            return res.render('error', { message: 'Contraseña incorrecta' });
          }
        } else {

          user = await userDAO.getUserByEmail(email);
          if (!user) {
            return res.render('error', { message: 'Usuario no encontrado' });
          }
          if (!isValidPassword(password, user)) {
            return res.render('error', { message: 'Contraseña incorrecta' });
          }
        }
      }

      const userDTO = new UserDTO(user);
      const isAdmin = user.role === 'admin';

      console.log('user.controller.js', 'authenticate', 'user', user);
      console.log('user.controller.js', 'authenticate', 'user.cartId', user.cartId);
      console.log('user.controller.js', 'authenticate', 'user.cart.toString()', user.cartId.toString());

      let token = jwt.sign({ user: userDTO, isAdmin }, jwtConfig.secretOrKey, { expiresIn: jwtConfig.tokenLife });
      res.cookie(jwtConfig.tokenName, token, { maxAge: cookieParserConfig.life_span, httpOnly: true });
      res.locals.user = userDTO;
      console.log('user.controller', req.user);
      return res.status(200).redirect('/');
    } catch (error) {
      return console.error(`User controller error -> ${error}`);
    }
  }

  getCurrent(req, res) {
    console.log('user.controller', 'getCurrent');
    const user = res.locals.user;
    const isAdmin = user.role === 'admin';
    return res.render('error', { title: 'Sesión Actual', message: JSON.stringify({ user: user, isAdmin }, null, 2), error: false, user: user });
  }

  logout(req, res) {
    console.log('user.controller', 'logout');
    if (req.cookies[jwtConfig.tokenName]) {
      return res.clearCookie(jwtConfig.tokenName).status(200).redirect('../../users/login');
    }
    return res.status(400).render('logout', { error: true, title: 'Cerrar sesión', message: 'Ups, sesión no encontrada.' });
  }
}

module.exports = UserController;
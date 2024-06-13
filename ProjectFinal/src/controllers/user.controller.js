const UserModel = require('../models/users.model.js');
const UserMongoDBDAO = require('../DAO/users/users.mongoDb.dao.js');
const userDAO = new UserMongoDBDAO();

const UserDTO = require('../DTO/user.dto.js');
const MailController = require('../controllers/mail.controller.js');
const mailController = new MailController();

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

  async uploadDocuments(req, res) {

    const { uid } = req.params;
    const uploadedDocuments = req.files;
    let documentType = req.body.type;
    try {

      if (!uploadedDocuments) {
        return res.status(400).send('No se detectaron documentos adjuntos.');
      }

      if (!documentType) {
        return res.status(400).send('Se debe declarar la propiedad (text) type -> [Identificación/Comprobante de domicilio/Comprobante de estado de cuenta].');
      }

      const user = await userDAO.getUserByID(uid);
      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }

      // Verificar si se subieron documentos y actualizar el usuario
      documentType = documentType.toString().split(',');
      if (uploadedDocuments.document) {
        user.documents = user.documents.concat(uploadedDocuments.document.map((doc, idx) => ({
          name: doc.originalname,
          reference: doc.path,
          documentType: documentType[idx]
        })));
      }

      // Guardar los cambios en la base de datos
      await user.save();

      res.status(200).send('Documentos subidos exitosamente');
    } catch (error) {
      req.logger.error(`User controller error -> ${error}`);
      res.status(500).send('Error interno del servidor');
    }
  }

  async changeUserRole(req, res) {
    try {
      const { uid } = req.params;

      const user = await userDAO.getUserByID(uid);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const newRole = user.role === 'user' ? 'premium' : 'user';

      // if user is currently premium, change to basic
      if (user.role === 'premium') {
        const updated = await userDAO.changeUserRole(user._id, newRole);
        return res.json(updated);
      }

      // Verificar si el usuario ha cargado los documentos requeridos
      const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
      const userDocuments = (user.documents ?? []).map(doc => doc.documentType);

      const hasRequiredDocuments = requiredDocuments.filter(doc => !userDocuments.includes(doc));

      if (hasRequiredDocuments.length > 0) {
        return res.status(400).json({ message: `El usuario debe cargar los documentos de tipo: ${hasRequiredDocuments.join(', ')}` });
      }

      const updated = await userDAO.changeUserRole(user._id, newRole);
      res.json(updated);
    } catch (error) {
      req.logger.error(`User controller error -> ${error}`);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async deleteInactiveUsers(req, res) {
    try {
      const processLog = [];
      req.logger.debug('user.controller', 'deleteInactiveUsers');
      const users = (await userDAO.getElegibleForDeletion()).map(user => new UserDTO(user));

      if (users.length === 0) {
        return res.status(200).send({ status: 'success', message: 'No hay usuarios inactivos', success: true });
      }

      for (const user of users) {

        const notificationStatus = await mailController.sendAccountDeleteNotification(user);
        if (!notificationStatus.success) {
          processLog.push({ status: 'error', payload: `No email sent to user ${user.email}. Delete process aborted. Error: ${notificationStatus.message}`, success: false });
        } else {
          processLog.push({ status: 'success', payload: `Email sent to user ${user.email}. Account deleted.`, success: true });
        }

        await userDAO.deleteUser(user.id);
      }

      res.status(200).json(processLog);

    } catch (error) {
      return res.status(500).json({ message: `User controller error -> ${error}.` });
    }
  }
  async getAllUsers(req, res) {
    try {
      req.logger.debug('user.controller', 'getAllUsers');
      const users = (await userDAO.getAllUsers()).map(user => new UserDTO(user));
      res.send({ status: 'success', payload: users, success: true });
    } catch (error) {
      return res.status(500).json({ message: `User controller error -> ${error}.` });
    }
  }
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
      req.logger.debug('user.controller', 'renderCreateUser');
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

      req.logger.debug('user.controller', 'body', req);
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
      // req.logger.debug('user.controller', 'findUserById', id);
      const user = await userDAO.getUserByID(id);
      if (!user) { return { code: 400, message: 'Usuario no encontrado', success: false }; }
      return { code: 200, user, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async login(req, res) {

    req.logger.debug('user.controller', 'login', 'req.body', req.body);
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

      req.logger.debug('user.controller.js', 'authenticate', 'user', user);
      req.logger.debug('user.controller.js', 'authenticate', 'user.cartId', user.cartId);
      req.logger.debug('user.controller.js', 'authenticate', 'user.cart.toString()', user.cartId?.toString());

      await userDAO.updateUser(user.id, { last_connection: new Date() });

      let token = jwt.sign({ user: userDTO, isAdmin }, jwtConfig.secretOrKey, { expiresIn: jwtConfig.tokenLife });
      res.cookie(jwtConfig.tokenName, token, { maxAge: cookieParserConfig.life_span, httpOnly: true });
      res.locals.user = userDTO;
      req.logger.debug('user.controller', req.user);
      return res.status(200).redirect('/');
    } catch (error) {
      return req.logger.error(`User controller error -> ${error}`);
    }
  }

  getCurrent(req, res) {
    req.logger.debug('user.controller', 'getCurrent');
    const user = res.locals.user;
    const isAdmin = user.role === 'admin';
    return res.render('error', { title: 'Sesión Actual', message: JSON.stringify({ user: user, isAdmin }, null, 2), error: false, user: user });
  }

  async logout(req, res) {
    req.logger.debug('user.controller', 'logout');

    await userDAO.updateUser(req.user?.id, { last_connection: new Date() });

    if (req.cookies[jwtConfig.tokenName]) {
      return res.clearCookie(jwtConfig.tokenName).status(200).redirect('../../users/login');
    }
    return res.status(400).render('logout', { error: true, title: 'Cerrar sesión', message: 'Ups, sesión no encontrada.' });
  }
}

module.exports = UserController;
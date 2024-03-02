const UserModel = require('../models/users.model');
const { isValidPassword } = require('../utils/hashBcrypt.js');

class SessionController {

  passport;

  constructor(passport) {
    this.passport = passport;
  }

  async login(req, user = undefined) {

    try {

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

      return { success: true, user, description: '', code: 200 };
    } catch (error) {
      return console.error(`Session Service error -> ${error}`);
    }
  }

  logout(req, res) {
    if (req.session?.login) {
      req.session.destroy();
      return { success: true, code: 200 };
    }
    return res.status(400).render('logout', { error: true, message: 'Ups, sesión no encontrada.' });
  }
}

module.exports = SessionController;
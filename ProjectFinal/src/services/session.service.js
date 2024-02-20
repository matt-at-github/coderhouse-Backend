const UserModel = require("../models/users.model.js");

async function login(req) {

  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return { sucess: false, description: 'Usuario no encontrado.', code: 404 };
    }

    if (user.password !== password) {
      return { sucess: false, description: 'Contraseña incorrecta.', code: 401 };
    }

    req.session.login = true;
    req.session.userName = user.first_name;
    req.session.isAdmin = user.role === 'admin'; // TODO: Improve

    return { sucess: true, user, description: '', code: 202 };
  } catch (error) {
    return console.log(`Session Service error -> ${error}`);
  }
}

function logout(req, res) {

  if (req.session?.login) {
    req.session.destroy();
    return true;
  }
  res.status(400).render('logout', { error: true, message: 'Ups, sesión no encontrada.' });
}

UserModel.login = login;
UserModel.logout = logout;
module.exports = UserModel;
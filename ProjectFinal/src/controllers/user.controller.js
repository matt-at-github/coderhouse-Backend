const UserMongoDBDAO = require('../DAO/users/users.mongoDb.dao.js');
const userDAO = new UserMongoDBDAO;

const passport = require('passport');

const SessionController = require('../controllers/session.controller.js');
const sessionController = new SessionController(passport);

class UserController {

  async createUser(req, res) {

    try {

      const exists = await userDAO.getUserByEmail(req);
      console.log('user.controller.js', 'exists', exists);
      if (exists) {
        return { code: 400, message: 'El email está siendo usado', success: false };
      }

      const response = await userDAO.createUser(req);
      if (!response) {
        return { code: 400, message: response.message, success: false };
      }

      const result = await sessionController.authenticate(req);
      if (!result.success) {
        return res.status(result.code).send({ message: result.message });
      }

      sessionController.login(req, req.user);

      return res.status(result.code).redirect('/');

    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async createGithubUser(profile) {

    try {
      const githubData = profile._json;
      if (githubData.email) {
        const exists = await userDAO.getUserByEmail({ email: githubData.email });
        if (exists) {
          return { code: 400, message: 'El email está siendo usado', success: false };
        }
      }

      if (profile.username) {
        const exists = await userDAO.getUserByEmail({ email: profile.username });
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

      const response = await userDAO.createUser({ req: body }); //await UserModel.create(user);
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
      const user = await userDAO.getUserByID(id); //await UserModel.findById(id);
      if (!user) { return { code: 400, message: 'Usuario no encontrado', success: false }; }
      return { code: 200, user, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }
}

module.exports = UserController;
const UserModel = require('../models/users.model.js');
const { createHash } = require("../utils/hashBcrypt.js");
class UserController extends UserModel {

  async createUser(req) {

    try {
      let { first_name, last_name, email, password, age } = req.body;
      age = Number(age);

      const exists = await UserModel.findOne({ email });
      if (exists) {
        return { code: 400, message: 'El email está siendo usado', success: false };
      }

      let user = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password)
      };

      const response = await UserModel.create(user);
      if (!response) {
        return { code: 400, message: response.message, success: false };
      }
      return { code: 200, user: response, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async createGithubUser(profile) {

    try {
      const githubData = profile._json;
      if (githubData.email) {
        const exists = await UserModel.findOne({ email: githubData.email });
        if (exists) {
          return { code: 400, message: 'El email está siendo usado', success: false };
        }
      }

      if (profile.username) {
        const exists = await UserModel.findOne({ email: profile.username });
        if (exists) {
          return { code: 400, message: 'El email está siendo usado', success: false, user: exists };
        }
      }

      const user = new UserModel();

      const fullName = githubData.name?.split(' ');
      user.first_name = fullName[0] ?? '';
      user.last_name = fullName[1] ?? '';
      user.email = githubData.email ?? profile.username ?? '';
      user.age = Number(githubData.age ?? 0);
      user.password = githubData.password ?? '';

      const response = await UserModel.create(user);
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
      const user = await UserModel.findById(id);
      if (!user) { return { code: 400, message: 'Usuario no encontrado', success: false }; }
      return { code: 200, user, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }
}

module.exports = UserController;
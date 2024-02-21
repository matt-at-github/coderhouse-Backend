const UserModel = require('../models/users.model.js');

class UserController {

  async createUser(req) {
    try {

      let { first_name, last_name, email, password, age } = req.body;
      age = Number(age);

      const exists = await UserModel.findOne({ email });
      if (exists) {
        return { code: 400, message: 'El email está siendo usado', success: false };
      }

      const newUser = await UserModel.create({ first_name, last_name, email, password, age });
      if (!newUser) {
        return { code: 400, message: newUser.message, success: false };
      }
      return { code: 200, data: newUser, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

}

module.exports = UserController;
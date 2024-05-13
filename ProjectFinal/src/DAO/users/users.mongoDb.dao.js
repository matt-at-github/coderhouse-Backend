const UserModel = require('../../models/users.model.js');
const CartModel = require('../../models/carts.model.js');

const { createHash } = require('../../utils/hashBcrypt.js');

class UserMongoDBDAO {

  async getUserByID(id) {
    try {
      const user = await UserModel.findById(id);
      // req.logger.debug('users.mongodb.dao', 'getUserByID', id);
      return user;
    } catch (error) {
      throw new Error(`Error at getting user. ${error}`);
    }
  }

  async getUserByEmail(email) {
    try {
      // req.logger.debug('users.mongodb.dao', 'getUserByEmail', email);
      const user = await UserModel.findOne({ email: email });
      // req.logger.debug('users.mongodb.dao', 'getUserByEmail', email);
      return user;
    } catch (error) {
      throw new Error(`Error at getting user. ${error}`);
    }
  }

  async createUser(req) {
    try {

      req.logger.debug('user.mongoDB.dao', 'createUser', 'req', req.body);
      let { first_name, last_name, email, password, age } = req.body;
      age = Number(age);

      const cart = await new CartModel().save();
      req.logger.debug('user.mongoDB.dao', 'createUser', 'cart', cart);
      let user = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        cartId: cart._id,
      };

      const result = await UserModel.create(user);
      req.logger.debug('users.mongoDB.dao', 'createUser', result);
      return result;
    } catch (error) {
      throw new Error(`Error at creating user. ${error}`);
    }
  }
}

module.exports = UserMongoDBDAO;
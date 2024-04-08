const UserModel = require('../../models/users.model.js');
const CartModel = require('../../models/carts.model.js');

const { createHash } = require('../../utils/hashBcrypt.js');

class UserMongoDBDAO {

  async getUserByID(id) {
    try {
      const user = await UserModel.findById(id);
      console.log('users.mongodb.dao', 'getUserByID', id);
      return user;
    } catch (error) {
      throw new Error(`Error at getting user. ${error}`);
    }
  }

  async getUserByEmail(email) {
    try {
      console.log('users.mongodb.dao', 'getUserByEmail', email);
      const user = await UserModel.findOne({ email: email });
      console.log('users.mongodb.dao', 'getUserByEmail', email);
      return user;
    } catch (error) {
      throw new Error(`Error at getting user. ${error}`);
    }
  }

  async createUser(req) {
    try {

      console.log('user.mongoDB.dao', 'createUser', 'req', req.body);
      console.log('user.mongoDB.dao', 'createUser', 'req.body.first_name', req.body.first_name);
      let { first_name, last_name, email, password, age } = req.body;
      age = Number(age);

      const cart = new CartModel();
      await cart.save();

      let user = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        cart
      };

      const result = await UserModel.create(user);
      return result;
    } catch (error) {
      throw new Error(`Error at creating user. ${error}`);
    }
  }
}

module.exports = UserMongoDBDAO;
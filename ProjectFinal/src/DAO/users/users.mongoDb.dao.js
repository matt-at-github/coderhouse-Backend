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
      let { first_name, last_name, email, password, age } = req.body;
      age = Number(age);

      const cart = await new CartModel().save();
      console.log('user.mongoDB.dao', 'createUser', 'cart', cart);
      let user = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        cartId: cart._id,
      };

      const result = await UserModel.create(user);
      console.log('users.mongoDB.dao', 'createUser', result);
      return result;
    } catch (error) {
      throw new Error(`Error at creating user. ${error}`);
    }
  }
}

module.exports = UserMongoDBDAO;
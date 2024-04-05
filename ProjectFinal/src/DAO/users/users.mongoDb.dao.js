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

  async getUserByEmail(req) {
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      console.log('users.mongodb.dao', 'getUserByEmail', req.body.email);
      return user;
    } catch (error) {
      throw new Error(`Error at getting user. ${error}`);
    }
  }

  async createUser(req) {
    try {

      let { first_name, last_name, email, password, age } = req.body;
      age = Number(age);

      const cart = new CartModel();
      cart.save();

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
      throw new Error('Error at creating cart', error);
    }
  }
}

module.exports = UserMongoDBDAO;
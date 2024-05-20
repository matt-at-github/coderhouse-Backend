const UserModel = require('../../models/users.model.js');
const CartModel = require('../../models/carts.model.js');

const { createHash, isOldPassword } = require('../../utils/hashBcrypt.js');

class UserMongoDBDAO {

  async changeRole(user) {
    try {

      if (user.role === 'user') {
        user.role = 'premium';
      }
      else if (user.role === 'premium') {
        user.role = 'user';
      }

      return await UserModel.findByIdAndUpdate(user.id, user, { new: true });

    } catch (err) {
      throw new Error(`Error at changing role. ${err}`);
    }
  }

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

  async updatePassword(email, newPassword) {
    try {

      // Find the user by email
      const user = await UserModel.findOne({ email });

      // If user not found, return error
      if (!user) {
        return { success: false, status: 404, message: 'User not found.' };
      }

      if (isOldPassword(newPassword, user)) {
        return { success: false, statustauts: 401, message: 'Password can not be the same as the old one.' };
      }

      // Update user's password
      user.password = createHash(newPassword);

      // Save the updated user object
      await user.save();

      // Return success response
      return { success: true, status: 200, message: 'Password updated successfully.' };
    } catch (error) {
      // If an error occurs, return error response
      return { success: false, status: 500, message: 'Internal Server Error' };
    }
  }
}

module.exports = UserMongoDBDAO;
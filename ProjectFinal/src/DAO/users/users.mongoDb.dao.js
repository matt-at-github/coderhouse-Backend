const UserModel = require('../../models/users.model.js');
const CartModel = require('../../models/carts.model.js');

const { createHash } = require('../../utils/hashBcrypt.js');

class UserMongoDBDAO {

  async updateUser(id, updateBody) {
    try {
      const result = await UserModel.findByIdAndUpdate(id, updateBody);
      return result;
    } catch (error) {
      throw new Error(`Error at updating user. ${error}`);
    }
  }
  async deleteUser(id) {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      throw new Error(`Error at deleting user. ${error}`);
    }
  }

  async getElegibleForDeletion() {
    try {
      // find all users that conection date is older than 30 days
      const users = await UserModel.find({ last_connection: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });

      // find all users that conection date is older than 5 days
      // const users = await UserModel.find({ last_connection: { $lt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) } });

      return users;
    } catch (error) {
      throw new Error(`Error at getting users. ${error}`);
    }
  }
  async getAllUsers() {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      throw new Error(`Error at getting users. ${error}`);
    }
  }

  async promoteUser(userId, newRole) {

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
    const userDocuments = user.documents.map(doc => doc.name);

    const hasRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

    if (!hasRequiredDocuments) {
      throw new Error('El usuario debe cargar los siguientes documentos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta');
    }

    return await UserModel.findByIdAndUpdate(userId, { role: newRole }, { new: true });
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
}

module.exports = UserMongoDBDAO;
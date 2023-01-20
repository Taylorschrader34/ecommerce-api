const createError = require('http-errors');
const UserModel = require('../models/user');
const UserModelInstance = new UserModel();

module.exports = class UserService {

  async get(data) {

    const { id } = data;

    try {
      // Check if user already exists
      const user = await UserModelInstance.getUserById(id);

      // If user doesn't exist, reject
      if (!user) {
        throw createError(404, 'User record not found');
      }

      return user;

    } catch(err) {
      throw createError(400, err.message);
    }

  };

  async update(data){

    try{
      // Check if user exists
      const user = await UserModelInstance.updateUser(data)

      return user;
    } catch(err){
      throw createError(400, err.message);
    }
  };

}
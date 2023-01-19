const expressLoader = require('./express');
const express = require('express');
const router = express.Router();

//Temp userService for intial db connection setup
const UserService = require('../services/UserService');
const UserServiceInstance = new UserService();

module.exports = async (app) => {

  // Load Express middlewares
  const expressApp = await expressLoader(app);

  //Test route
  app.get('/users/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params;
      const response = await UserServiceInstance.get({ id: userId });
      res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  });

  // Error Handler
  app.use((err, req, res, next) => {
    const { message, status } = err;
  
    return res.status(status).send({ message });
  });
}
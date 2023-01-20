const express = require('express');
const router = express.Router();
const CartService = require('../services/CartService');

const CartServiceInstance = new CartService();

module.exports = (app, passport) => {

  app.use('/carts', router);

  router.post('/mine', async (req, res, next) => {
    try {
      const { id } = req.user;
      const response = await CartServiceInstance.createCart({ userId: id });

      res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  });


  router.get('/mine', async (req, res, next) => {
    try {
      const { id } = req.user;
      
      const response = await CartServiceInstance.getCart(id);

      res.status(200).send(response);

    } catch(err) {
      next(err);
    }
  });

  router.post('/mine/items', async (req, res, next) => {
    try {
      const { id } = req.user;
      const data = req.body;
    
      const response = await CartServiceInstance.addItemToCart(id, data);

      res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  });

  router.put('/mine/items/:cartItemId', async (req, res, next) => {
    try {
      const { cartItemId } = req.params;
      const data = req.body;
      
      const response = await CartServiceInstance.updateItemInCart(cartItemId, data);

      res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  });

  router.delete('/mine/items/:cartItemId', async (req, res, next) => {
    try {
      const { cartItemId } = req.params;
    
      const response = await CartServiceInstance.removeItemFromCart(cartItemId);

      res.status(200).send(response);
    } catch(err) {
      next(err);
    }
  });

}
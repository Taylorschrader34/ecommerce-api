const express = require('express');
const router = express.Router();

const ProductService = require('../services/ProductService');
const ProductServiceInstance = new ProductService();

module.exports = (app) => {

    app.use('/products', router);

    router.post('/', async (req, res, next) => {
        try {
            const data = req.body;

            const response = await ProductServiceInstance.create(data);
            res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    });

    router.put('/:productId', async (req, res, next) => {
        try {
          const { productId } = req.params;
          const data = req.body;
    
          const response = await ProductServiceInstance.update({ id: productId, ...data });
          res.status(200).send(response);
        } catch(err) {
          next(err);
        }
      });

    router.get('/', async (req, res, next) => {
        try {

            const queryParams = req.query;

            const response = await ProductServiceInstance.getList(queryParams);
            res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    });

    router.get('/:productId', async (req, res, next) => {
        try {
            const { productId } = req.params;

            const response = await ProductServiceInstance.get(productId);

            res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    });
}
const createError = require('http-errors');
const ProductModel = require('../models/product');
const ProductModelInstance = new ProductModel();

module.exports = class ProductService {

    async create(data) {
        const { name } = data;

        try {
            // Check if product already exists
            const product = await ProductModelInstance.getProductByName(name);

            // If product already exists, reject
            if (product) {
                throw createError(409, 'Product already exists');
            }

            // Product doesn't exist, create new product record
            return await ProductModelInstance.createProduct(data);

        } catch (err) {
            throw createError(500, err);
        }

    };

    async update(data) {

        try {
            // Check if product already exists
            const product = await ProductModelInstance.update(data);

            return product;

        } catch (err) {
            throw createError(400, err);
        }

    };

    async getList(options) {

        try {
            // Get products
            const products = await ProductModelInstance.GetProducts(options);

            return products;

        } catch (err) {
            throw createError(400, err.message);
        }

    };

    async get(id) {

        try {
            // Check if product exists
            const product = await ProductModelInstance.GetProduct(id);

            // If no product found, reject
            if (!product) {
                throw createError(404, 'Product not found');
            }

            return product;

        } catch (err) {
            throw createError(400, err.message);
        }

    };

}
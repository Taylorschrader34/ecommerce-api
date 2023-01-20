const db = require('../db');
const pgp = require('pg-promise')({ capSQL: true });

module.exports = class ProductModel {

    /**
    * Retrieve product by ID
    * @param  {Object}      data [Product data]
    * @return {Object|null}      [Product record]
    */
    async createProduct(data) {
        try {

            // Generate SQL statement - using helper for dynamic parameter injection
            const statement = pgp.helpers.insert(data, null, 'products') + 'RETURNING *';

            // Execute SQL statment
            const result = await db.query(statement);

            if (result.rows?.length) {
                return result.rows[0];
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }

    /**
   * Updates a product record
   * @param  {Object}      data [Product data]
   * @return {Object|null}      [Updated product record]
   */
    async update(data) {
        try {

            const { id, ...params } = data;

            // Generate SQL statement - using helper for dynamic parameter injection
            const condition = pgp.as.format('WHERE id = ${id} RETURNING *', { id });
            const statement = pgp.helpers.update(params, null, 'products') + condition;

            // Execute SQL statment
            const result = await db.query(statement);

            if (result.rows?.length) {
                return result.rows[0];
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Get products list
     * @param  {Object} options [Query options]
     * @return {Array}          [Array of products]
     */
    async GetProducts(options = {}) {
        try {

            const condition = pgp.as.format('WHERE id = ${id} RETURNING *', { id });
            const statement = `SELECT *
                         FROM products`;
            const values = [];

            const result = await db.query(statement, values);

            if (result.rows?.length) {
                return result.rows;
            }

            return [];

        } catch (err) {
            throw err;
        }
    }

    /**
     * Retrieve product by ID
     * @param  {Object}      id [Product ID]
     * @return {Object|null}    [Product record]
     */
    async GetProduct(id) {
        try {

            const statement = `SELECT *
                         FROM products
                         WHERE id = $1`;
            const values = [id];

            const result = await db.query(statement, values);

            if (result.rows?.length) {
                return result.rows[0]
            }

            return null;

        } catch (err) {
            throw err;
        }
    }

    /**
     * Finds a product record by name
     * @param  {String}      name [Product name]
     * @return {Object|null}      [Product record]
     */
    async getProductByName(name) {
        try {
            // Generate SQL statement
            const statement = `SELECT *
                         FROM products
                         WHERE name = $1`;
            const values = [name];

            // Execute SQL statment
            const result = await db.query(statement, values);

            if (result.rows?.length) {
                return result.rows[0]
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }
}
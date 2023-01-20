const db = require('../db');
const moment = require('moment');
const pgp = require('pg-promise')({ capSQL: true });
const OrderItem = require('./orderItem');

module.exports = class OrderModel {

    constructor(data = {}) {
        this.userid = data.userid || null;
        this.total = data.total || 0;
        this.status = data.status || 'PENDING';
        this.created = data.created || moment.utc().toISOString();
        this.modified = moment.utc().toISOString();
        this.items = data.items || [];
    }

    addItems(items) {
        this.items = items.map(item => new OrderItem(item));
    }

    /**
     * Creates a new order for a user
     * @return {Object|null}        [Created order record]
     */
    async createOrder() {
        try {

            const { items, ...order } = this;

            // Generate SQL statement - using helper for dynamic parameter injection
            const orderStatement = pgp.helpers.insert(order, null, 'orders') + ' RETURNING *';
            // Execute SQL statment
            const orderResult = await db.query(orderStatement);
            if (orderResult.rows?.length) {
                // Add new information generated in the database (ie: id) to the Order instance properties
                Object.assign(this, orderResult.rows[0]);
                
                // Generate SQL statement - using helper for dynamic parameter injection
                // for adding items in order to OrderItems table
                const cs = new pgp.helpers.ColumnSet(['productid', 'qty', 'orderid'], { table: 'orderitems' });
                var values = [];

                items.forEach((item, index) => {
                    values.push({
                        productid: item.productid,
                        qty: item.qty,
                        orderid: orderResult.rows[0].id
                    });
                })
                const orderItemsStatement = pgp.helpers.insert(values, cs);

                // Execute SQL statment
                const orderItemsResult = await db.query(orderItemsStatement);

                return orderResult.rows[0];
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Updates an order for a user
     * @param  {Object}      id   [Order ID]
     * @param  {Object}      data [Order data to update]
     * @return {Object|null}      [Updated order record]
     */
    async update(data) {
        try {

            // Generate SQL statement - using helper for dynamic parameter injection
            const condition = pgp.as.format('WHERE id = ${id} RETURNING *', { id: this.id });
            const statement = pgp.helpers.update(data, null, 'orders') + condition;

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
     * Loads orders for a user
     * @param  {number} userid [User ID]
     * @return {Array}         [Order records]
     */
    static async getOrderByUserId(userid) {
        try {

            // Generate SQL statement
            const statement = `SELECT *
                         FROM orders
                         WHERE "userid" = $1`;
            const values = [userid];

            // Execute SQL statment
            const result = await db.query(statement, values);

            if (result.rows?.length) {
                return result.rows[0];
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Retrieve order by ID
     * @param  {number}      orderId [Order ID]
     * @return {Object|null}         [Order record]
     */
    static async getOrder(orderId) {
        try {

            // Generate SQL statement
            const statement = `SELECT *
                         FROM orders
                         WHERE id = $1`;
            const values = [orderId];

            // Execute SQL statment
            const result = await db.query(statement, values);

            if (result.rows?.length) {
                return result.rows[0];
            }

            return null;

        } catch (err) {
            throw new Error(err);
        }
    }

}
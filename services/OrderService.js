const createError = require('http-errors');
const OrderModel = require('../models/order');
const OrderItemModel = require('../models/orderItem');
const CartService = require('./CartService');
const CartServiceInstance = new CartService();

module.exports = class OrderService {

    async createOrder(data) {
        const userid = data;

        try {
            //Get cart total
            var userTotal = 0;
            var userCart;
            try {

                userCart = await CartServiceInstance.getCart(userid);
                if (!userCart.items.length) {
                    throw createError(404, "User Cart is empty.");
                }

                userCart.items.forEach((item, index) => {
                    userTotal += item.price * item.qty;
                });

            } catch (err) {
                throw createError(400, err.message);
            }

            // Instantiate new order and save
            const Order = new OrderModel({ userid, total: userTotal });
            Order.addItems(userCart.items)
            const order = await Order.createOrder();

            return userCart;

        } catch (err) {
            throw createError(400, err.message);
        }

    };

    async getList(userId) {
        try {
            // Load user orders based on ID
            const orders = await OrderModel.getOrderByUserId(userId);

            return orders;

        } catch (err) {
            throw createError(400, err.message);
        }
    }

    async get(orderId) {
        try {
            // Load user orders based on ID
            const order = await OrderModel.getOrder(orderId);

            return order;

        } catch (err) {
            throw createError(400, err.message);
        }
    }

}
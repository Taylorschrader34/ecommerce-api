const createError = require('http-errors');
const CartModel = require('../models/cart');
const OrderModel = require('../models/order');
const CartItemModel = require('../models/cartItem');

module.exports = class CartService {

  async createCart(data) {
    const { userId } = data;

    try {

      // Crate new cart and save
      const Cart = new CartModel();
      const cart = await Cart.createCart(userId);

      return cart;

    } catch(err) {
      throw createError(500, err);
    }

  };

  async getCart(userId) {
    try {
      // Load user cart based on ID
      const cart = await CartModel.getCartByUserId(userId);

      // Load cart items and add them to the cart record
      const items = await CartItemModel.getCartItems(cart.id);
      cart.items = items;

      return cart;

    } catch(err) {
      throw createError(400, err.message);
    }
  }

  async addItemToCart(userId, item) {
    try {
      // Load user cart based on ID
      const cart = await CartModel.getCartByUserId(userId);

      // Create cart item
      const cartItem = await CartItemModel.createCartItem({ cartid: cart.id, ...item });

      return cartItem;

    } catch(err) {
      throw createError(400, err.message);
    }
  }

  async updateItemInCart(cartItemId, data) {
    try {
      // Remove cart item by line ID
      const cartItem = await CartItemModel.updateCartItem(cartItemId, data);

      return cartItem;

    } catch(err) {
      throw createError(400, err.message);
    }
  }
  
  async removeItemFromCart(cartItemId) {
    try {
      // Remove cart item by line ID
      const cartItem = await CartItemModel.deleteCartItem(cartItemId);

      return cartItem;

    } catch(err) {
      throw createError(400, err.message);
    }
  }

  async checkout(cartId, userId, paymentInfo) {
    try {

      const stripe = require('stripe')('sk_test_FOY6txFJqPQvJJQxJ8jpeLYQ');

      // Load cart items
      const cartItems = await CartItemModel.find(cartId);

      // Generate total price from cart items
      const total = cartItems.reduce((total, item) => {
        return total += Number(item.price);
      }, 0);

      // Generate initial order
      const Order = new OrderModel({ total, userId });
      Order.addItems(cartItems);
      await Order.create();

      // Make charge to payment method (not required in this project)
      const charge = await stripe.charges.create({
        amount: total,
        currency: 'usd',
        source: paymentInfo.id,
        description: 'ecommerce test charge'
      });

      // On successful charge to payment method, update order status to COMPLETE
      const order = Order.update({ status: 'COMPLETE' });

      return order;

    } catch(err) {
      throw err;
    }
  }

}
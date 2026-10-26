const Cart = require('../models/Cart');
const Order = require('../models/Order');

const payments = ['Cash on Delivery', 'UPI', 'Credit / Debit Card', 'Net Banking'];

exports.create = async (req, res, next) => {
  try {
    const { name, email, phone, address, city, pincode } = req.body.deliveryDetails || {};
    const paymentMethod = req.body.paymentMethod;
    if (![name, email, phone, address, city, pincode].every(value => String(value || '').trim()) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[0-9+()\-\s]{7,18}$/.test(phone) || !/^\d{6}$/.test(pincode))
      return res.status(400).json({ message: 'Please complete all delivery fields with a valid email, phone number, and 6-digit pincode.' });
    if (!payments.includes(paymentMethod)) return res.status(400).json({ message: 'Choose a valid payment method.' });
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || !cart.items.length) return res.status(400).json({ message: 'Your cart is empty.' });
    const items = cart.items.map(({ product, quantity }) => ({ product: product.id, name: product.name, price: product.price, quantity }));
    const subtotal = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
    const delivery = 49.99;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const order = await Order.create({ user: req.user.id, items, subtotal, delivery, tax, total: Number((subtotal + delivery + tax).toFixed(2)), deliveryDetails: { name, email, phone, address, city, pincode }, paymentMethod });
    cart.items = [];
    await cart.save();
    res.status(201).json({ message: 'Your order has been placed!', order });
  } catch (error) { next(error); }
};

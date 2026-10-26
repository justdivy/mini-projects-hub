const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, name: String, price: Number, quantity: Number }],
  subtotal: { type: Number, required: true }, delivery: { type: Number, required: true }, tax: { type: Number, required: true }, total: { type: Number, required: true },
  deliveryDetails: { name: String, email: String, phone: String, address: String, city: String, pincode: String },
  paymentMethod: { type: String, enum: ['Cash on Delivery', 'UPI', 'Credit / Debit Card', 'Net Banking'], required: true },
  status: { type: String, default: 'placed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

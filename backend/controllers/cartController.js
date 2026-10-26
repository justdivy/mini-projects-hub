const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function getPopulatedCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  await cart.populate('items.product');
  return cart;
}

exports.get = async (req, res, next) => {
  try { res.json({ cart: await getPopulatedCart(req.user.id) }); }
  catch (error) { next(error); }
};

exports.add = async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity || 1);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) return res.status(400).json({ message: 'Quantity must be between 1 and 20.' });
    const product = await Product.findOne({ _id: req.body.productId, active: true });
    if (!product) return res.status(404).json({ message: 'Menu item not found.' });
    const cart = await Cart.findOneAndUpdate({ user: req.user.id }, { $setOnInsert: { user: req.user.id } }, { upsert: true, new: true });
    const line = cart.items.find(item => item.product.equals(product.id));
    if (line) line.quantity = Math.min(99, line.quantity + quantity);
    else cart.items.push({ product: product.id, quantity });
    await cart.save();
    res.json({ cart: await getPopulatedCart(req.user.id) });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return res.status(400).json({ message: 'Quantity must be between 1 and 99.' });
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found.' });
    const item = cart.items.find(entry => entry.product.equals(req.params.productId));
    if (!item) return res.status(404).json({ message: 'Cart item not found.' });
    item.quantity = quantity;
    await cart.save();
    res.json({ cart: await getPopulatedCart(req.user.id) });
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) { cart.items = cart.items.filter(item => !item.product.equals(req.params.productId)); await cart.save(); }
    res.json({ cart: await getPopulatedCart(req.user.id) });
  } catch (error) { next(error); }
};

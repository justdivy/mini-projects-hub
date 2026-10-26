const Product = require('../models/Product');
exports.list = async (req, res, next) => {
  try { res.json({ products: await Product.find({ active: true }).sort({ createdAt: 1 }) }); }
  catch (error) { next(error); }
};

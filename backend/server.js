require('dotenv').config();
const path = require('path');
const express = require('express');
const connectDatabase = require('./config/db');
const Product = require('./models/Product');
const initialProducts = require('./data/products');

const app = express();
app.use(express.json({ limit: '20kb' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use((req, res) => res.status(404).json({ message: 'Page or API route not found.' }));
app.use((error, req, res, next) => {
  console.error(error);
  if (error.code === 11000) return res.status(409).json({ message: 'That email is already registered.' });
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid item identifier.' });
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

const port = process.env.PORT || 3000;
connectDatabase().then(async () => {
  for (const item of initialProducts) await Product.updateOne({ name: item.name }, { $setOnInsert: item }, { upsert: true });
  app.listen(port, () => console.log(`BellyBoss is running at http://localhost:${port}`));
}).catch(error => { console.error(error.message); process.exit(1); });

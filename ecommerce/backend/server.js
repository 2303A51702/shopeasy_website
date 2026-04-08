require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/', (_req, res) => {
  res.send('API is running..');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/delivery', require('./routes/delivery'));

// Connect to DB then start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Kill the process and try again.`);
      process.exit(1);
    }
  });
});

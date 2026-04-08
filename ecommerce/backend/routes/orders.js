const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Place order
router.post('/', auth, async (req, res) => {
  try {
    const { address, paymentMethod = 'cod' } = req.body;
    const user = await User.findById(req.user.id).populate('cart.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.cart.length) return res.status(400).json({ message: 'Cart is empty' });

    const items = user.cart.map(i => ({
      product: i.product._id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity
    }));

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // Reduce stock for each product
    for (const item of user.cart) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    const paymentStatus = paymentMethod === 'online' ? 'paid' : 'unpaid';
    const order = await Order.create({ user: req.user.id, items, total, address, paymentMethod, paymentStatus });

    // Clear cart
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

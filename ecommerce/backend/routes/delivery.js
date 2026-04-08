const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Delivery partner middleware
const dpAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isDeliveryPartner) return res.status(403).json({ message: 'Delivery partner access only' });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Signup as delivery partner
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, isDeliveryPartner: true, phone });
    const token = jwt.sign({ id: user._id, isDeliveryPartner: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, isDeliveryPartner: true } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login as delivery partner
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isDeliveryPartner: true });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, isDeliveryPartner: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isDeliveryPartner: true } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get assigned orders (active)
router.get('/orders', dpAuth, async (req, res) => {
  try {
    const orders = await Order.find({
      assignedTo: req.user.id,
      status: { $in: ['processing', 'out_for_delivery'] }
    }).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get delivery history (delivered orders)
router.get('/history', dpAuth, async (req, res) => {
  try {
    const orders = await Order.find({
      assignedTo: req.user.id,
      status: 'delivered'
    }).populate('user', 'name email').sort({ updatedAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.put('/orders/:id', dpAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['out_for_delivery', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const updates = { status };
    if (status === 'delivered') updates.paymentStatus = 'paid';
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user.id },
      updates, { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found or not assigned to you' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

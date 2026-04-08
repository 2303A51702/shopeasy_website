const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Get all products
router.get('/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create product
router.post('/products', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const product = await Product.create({ name, description, price, category, stock, image });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product
router.put('/products/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all delivery partners
router.get('/delivery-partners', adminAuth, async (req, res) => {
  try {
    const User = require('../models/User');
    const partners = await User.find({ isDeliveryPartner: true }, 'name email');
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign delivery partner to order
router.put('/orders/:id/assign', adminAuth, async (req, res) => {
  try {
    const { partnerId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedTo: partnerId, status: 'processing' },
      { new: true }
    ).populate('assignedTo', 'name email');
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all delivery partners
router.get('/delivery-partners', adminAuth, async (req, res) => {
  try {
    const User = require('../models/User');
    const partners = await User.find({ isDeliveryPartner: true }, 'name email phone');
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign delivery partner + set processing
router.put('/orders/:id/assign', adminAuth, async (req, res) => {
  try {
    const { partnerId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedTo: partnerId, status: 'processing' },
      { new: true }
    ).populate('assignedTo', 'name email');
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.put('/orders/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const updates = { status };

    // Auto-mark COD as paid when delivered
    if (status === 'delivered') {
      updates.paymentStatus = 'paid';
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

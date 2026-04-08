const express = require('express');
const Order = require('../models/Order');
const { deliveryAuth } = require('../middleware/auth');
const router = express.Router();

// Get orders assigned to this delivery partner
router.get('/orders', deliveryAuth, async (req, res) => {
  try {
    const orders = await Order.find({
      assignedTo: req.user.id,
      status: { $in: ['processing', 'shipped'] }
    }).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order to shipped or delivered
router.put('/orders/:id', deliveryAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['shipped', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Can only set shipped or delivered' });
    }
    const updates = { status };
    if (status === 'delivered') updates.paymentStatus = 'paid';
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.user.id },
      updates,
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found or not assigned to you' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

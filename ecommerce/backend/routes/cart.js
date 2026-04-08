const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existing = user.cart.find(i => i.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    res.json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update quantity
router.put('/update', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const item = user.cart.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      user.cart = user.cart.filter(i => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }
    await user.save();
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove from cart
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = user.cart.filter(i => i.product.toString() !== req.params.productId);
    await user.save();
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

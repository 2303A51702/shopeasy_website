const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  address: { type: String, required: true },
  paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

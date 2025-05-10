const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['purchase', 'usage', 'refund', 'bonus'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  metadata: {
    description: String,
    source: {
      type: String,
      enum: ['stripe', 'paypal', 'manual', 'system'],
      required: true
    },
    transactionId: String,
    model: String,
    feature: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
creditSchema.index({ user: 1, createdAt: -1 });
creditSchema.index({ status: 1, type: 1 });

module.exports = mongoose.model('Credit', creditSchema); 
const mongoose = require('mongoose');

const cheggExtensionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  creditPrice: {
    type: Number,
    required: true,
    default: 0
  },
  users: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    creditsUsed: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    cheggIdName: {
      type: String,
      required: true
    }
  }],
  metadata: {
    totalUsers: {
      type: Number,
      default: 0
    },
    totalCreditsUsed: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Indexes for faster queries
cheggExtensionSchema.index({ name: 1 });
cheggExtensionSchema.index({ 'users.user': 1 });
cheggExtensionSchema.index({ active: 1 });

module.exports = mongoose.model('CheggExtension', cheggExtensionSchema); 
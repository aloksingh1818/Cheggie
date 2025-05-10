const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  metrics: {
    totalRequests: {
      type: Number,
      default: 0
    },
    creditsUsed: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    },
    avgResponseTime: {
      type: Number,
      default: 0
    }
  },
  modelUsage: [{
    model: {
      type: String,
      required: true
    },
    requests: {
      type: Number,
      default: 0
    },
    credits: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    },
    avgResponseTime: {
      type: Number,
      default: 0
    }
  }],
  featureUsage: [{
    feature: {
      type: String,
      required: true
    },
    requests: {
      type: Number,
      default: 0
    },
    credits: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    },
    avgResponseTime: {
      type: Number,
      default: 0
    }
  }],
  questionStats: {
    total: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    solved: {
      type: Number,
      default: 0
    },
    flagged: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for faster queries
analyticsSchema.index({ user: 1, date: -1 });
analyticsSchema.index({ date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema); 
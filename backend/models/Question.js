const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    tokens: {
      type: Number,
      default: 0
    },
    creditsUsed: {
      type: Number,
      default: 0
    }
  }
});

const questionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'solved', 'flagged'],
    default: 'pending'
  },
  source: {
    type: String,
    enum: ['chegg', 'manual', 'import'],
    required: true
  },
  answers: [answerSchema],
  metadata: {
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    tags: [{
      type: String
    }],
    cheggId: {
      type: String,
      sparse: true
    },
    processingTime: {
      type: Number,
      default: 0
    },
    creditsUsed: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for faster queries
questionSchema.index({ user: 1, status: 1 });
questionSchema.index({ subject: 1, status: 1 });
questionSchema.index({ 'metadata.tags': 1 });
questionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Question', questionSchema); 
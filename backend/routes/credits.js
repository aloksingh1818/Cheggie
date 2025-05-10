const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Credit = require('../models/Credit');
const User = require('../models/User');

// Get user's credit history
router.get('/history', auth, async (req, res) => {
  try {
    const { type, status, startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const credits = await Credit.find(query)
      .sort({ createdAt: -1 });
    res.json(credits);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's current credit balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('credits');
    res.json({ credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Purchase credits
router.post('/purchase', auth, async (req, res) => {
  try {
    const { amount, source, transactionId } = req.body;

    // Create credit transaction
    const credit = new Credit({
      user: req.user._id,
      amount,
      type: 'purchase',
      status: 'pending',
      metadata: {
        source,
        transactionId
      }
    });

    await credit.save();

    // In a real application, you would integrate with a payment processor here
    // For now, we'll simulate a successful purchase
    credit.status = 'completed';
    await credit.save();

    // Update user's credit balance
    const user = await User.findById(req.user._id);
    user.credits += amount;
    await user.save();

    res.status(201).json(credit);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add credits (admin only)
router.post('/add', adminAuth, async (req, res) => {
  try {
    const { userId, amount, description } = req.body;

    // Create credit transaction
    const credit = new Credit({
      user: userId,
      amount,
      type: 'bonus',
      status: 'completed',
      metadata: {
        description,
        source: 'manual'
      }
    });

    await credit.save();

    // Update user's credit balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.credits += amount;
    await user.save();

    res.status(201).json(credit);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Refund credits
router.post('/refund', auth, async (req, res) => {
  try {
    const { amount, reason } = req.body;

    // Create credit transaction
    const credit = new Credit({
      user: req.user._id,
      amount: -amount,
      type: 'refund',
      status: 'pending',
      metadata: {
        description: reason,
        source: 'system'
      }
    });

    await credit.save();

    // In a real application, you would process the refund here
    // For now, we'll simulate a successful refund
    credit.status = 'completed';
    await credit.save();

    // Update user's credit balance
    const user = await User.findById(req.user._id);
    user.credits -= amount;
    await user.save();

    res.status(201).json(credit);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get credit transaction details
router.get('/:id', auth, async (req, res) => {
  try {
    const credit = await Credit.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!credit) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(credit);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system-wide credit statistics (admin only)
router.get('/stats/system', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const credits = await Credit.find(query);

    // Calculate statistics
    const stats = credits.reduce((acc, curr) => {
      if (curr.type === 'purchase') {
        acc.totalPurchased += curr.amount;
        acc.totalTransactions++;
      } else if (curr.type === 'usage') {
        acc.totalUsed += Math.abs(curr.amount);
      } else if (curr.type === 'refund') {
        acc.totalRefunded += Math.abs(curr.amount);
      }
      return acc;
    }, {
      totalPurchased: 0,
      totalUsed: 0,
      totalRefunded: 0,
      totalTransactions: 0
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user credits
router.get('/', auth, async (req, res) => {
  try {
    res.json({ message: 'Credits endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add credits (admin only)
router.post('/add', auth, async (req, res) => {
  try {
    res.json({ message: 'Add credits endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
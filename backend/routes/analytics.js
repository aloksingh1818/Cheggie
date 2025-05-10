const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Question = require('../models/Question');
const Chat = require('../models/Chat');

// Get analytics data
router.get('/', adminAuth, async (req, res) => {
  try {
    res.json({ message: 'Analytics endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's analytics
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const analytics = await Analytics.find(query)
      .sort({ date: -1 })
      .limit(30); // Last 30 days by default

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific date analytics
router.get('/date/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const analytics = await Analytics.findOne({
      user: req.user._id,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });

    if (!analytics) {
      return res.status(404).json({ message: 'Analytics not found for this date' });
    }

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get model usage statistics
router.get('/models', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const analytics = await Analytics.find(query)
      .select('modelUsage date')
      .sort({ date: -1 });

    // Aggregate model usage across all dates
    const modelStats = analytics.reduce((acc, curr) => {
      curr.modelUsage.forEach(usage => {
        if (!acc[usage.model]) {
          acc[usage.model] = {
            requests: 0,
            credits: 0,
            successRate: 0,
            avgResponseTime: 0,
            count: 0
          };
        }
        acc[usage.model].requests += usage.requests;
        acc[usage.model].credits += usage.credits;
        acc[usage.model].successRate += usage.successRate;
        acc[usage.model].avgResponseTime += usage.avgResponseTime;
        acc[usage.model].count += 1;
      });
      return acc;
    }, {});

    // Calculate averages
    Object.keys(modelStats).forEach(model => {
      const stats = modelStats[model];
      stats.successRate = stats.successRate / stats.count;
      stats.avgResponseTime = stats.avgResponseTime / stats.count;
      delete stats.count;
    });

    res.json(modelStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feature usage statistics
router.get('/features', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const analytics = await Analytics.find(query)
      .select('featureUsage date')
      .sort({ date: -1 });

    // Aggregate feature usage across all dates
    const featureStats = analytics.reduce((acc, curr) => {
      curr.featureUsage.forEach(usage => {
        if (!acc[usage.feature]) {
          acc[usage.feature] = {
            requests: 0,
            credits: 0,
            successRate: 0,
            avgResponseTime: 0,
            count: 0
          };
        }
        acc[usage.feature].requests += usage.requests;
        acc[usage.feature].credits += usage.credits;
        acc[usage.feature].successRate += usage.successRate;
        acc[usage.feature].avgResponseTime += usage.avgResponseTime;
        acc[usage.feature].count += 1;
      });
      return acc;
    }, {});

    // Calculate averages
    Object.keys(featureStats).forEach(feature => {
      const stats = featureStats[feature];
      stats.successRate = stats.successRate / stats.count;
      stats.avgResponseTime = stats.avgResponseTime / stats.count;
      delete stats.count;
    });

    res.json(featureStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get question statistics
router.get('/questions', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const analytics = await Analytics.find(query)
      .select('questionStats date')
      .sort({ date: -1 });

    // Aggregate question stats across all dates
    const questionStats = analytics.reduce((acc, curr) => {
      Object.keys(curr.questionStats).forEach(status => {
        if (!acc[status]) acc[status] = 0;
        acc[status] += curr.questionStats[status];
      });
      return acc;
    }, {});

    res.json(questionStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system-wide analytics (admin only)
router.get('/system', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const analytics = await Analytics.find(query)
      .sort({ date: -1 });

    // Aggregate system-wide metrics
    const systemStats = analytics.reduce((acc, curr) => {
      acc.totalRequests += curr.metrics.totalRequests;
      acc.creditsUsed += curr.metrics.creditsUsed;
      acc.successRate += curr.metrics.successRate;
      acc.avgResponseTime += curr.metrics.avgResponseTime;
      acc.count += 1;
      return acc;
    }, {
      totalRequests: 0,
      creditsUsed: 0,
      successRate: 0,
      avgResponseTime: 0,
      count: 0
    });

    // Calculate averages
    systemStats.successRate = systemStats.successRate / systemStats.count;
    systemStats.avgResponseTime = systemStats.avgResponseTime / systemStats.count;
    delete systemStats.count;

    res.json(systemStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
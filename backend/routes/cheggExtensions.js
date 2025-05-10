const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const CheggExtension = require('../models/CheggExtension');
const User = require('../models/User');

// Get all extensions (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const extensions = await CheggExtension.find()
      .populate('users.user', 'name email')
      .sort({ createdAt: -1 });
    res.json(extensions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's extensions
router.get('/my-extensions', auth, async (req, res) => {
  try {
    const extensions = await CheggExtension.find({
      'users.user': req.user._id
    }).populate('users.user', 'name email');
    res.json(extensions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get extension by ID (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const extension = await CheggExtension.findById(req.params.id)
      .populate('users.user', 'email name');
    
    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }
    
    res.json(extension);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new extension (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, creditPrice } = req.body;
    const extension = new CheggExtension({
      name,
      description,
      creditPrice
    });
    await extension.save();
    res.status(201).json(extension);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update extension (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const { active, creditPrice } = req.body;
    const extension = await CheggExtension.findById(req.params.id);
    
    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }

    if (active !== undefined) extension.active = active;
    if (creditPrice !== undefined) extension.creditPrice = creditPrice;
    
    extension.metadata.lastUpdated = new Date();
    await extension.save();
    
    res.json(extension);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add user to extension (admin only)
router.post('/:id/users', adminAuth, async (req, res) => {
  try {
    const { userId, cheggIdName } = req.body;
    const extension = await CheggExtension.findById(req.params.id);
    
    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already exists in extension
    const existingUser = extension.users.find(u => u.user.toString() === userId);
    if (existingUser) {
      return res.status(400).json({ message: 'User already added to extension' });
    }

    extension.users.push({
      user: userId,
      cheggIdName,
      status: 'active'
    });

    extension.metadata.totalUsers += 1;
    extension.metadata.lastUpdated = new Date();
    await extension.save();
    
    res.json(extension);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status in extension (admin only)
router.patch('/:id/users/:userId', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const extension = await CheggExtension.findById(req.params.id);
    
    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }

    const userIndex = extension.users.findIndex(u => u.user.toString() === req.params.userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found in extension' });
    }

    extension.users[userIndex].status = status;
    extension.metadata.lastUpdated = new Date();
    await extension.save();
    
    res.json(extension);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user credits in extension (admin only)
router.patch('/:id/users/:userId/credits', adminAuth, async (req, res) => {
  try {
    const { creditsUsed } = req.body;
    const extension = await CheggExtension.findById(req.params.id);
    
    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }

    const userIndex = extension.users.findIndex(u => u.user.toString() === req.params.userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found in extension' });
    }

    const oldCredits = extension.users[userIndex].creditsUsed;
    extension.users[userIndex].creditsUsed = creditsUsed;
    extension.metadata.totalCreditsUsed += (creditsUsed - oldCredits);
    extension.metadata.lastUpdated = new Date();
    await extension.save();
    
    res.json(extension);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove user from extension (admin only)
router.delete('/:id/users/:userId', adminAuth, async (req, res) => {
  try {
    const extension = await CheggExtension.findById(req.params.id);
    
    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }

    const userIndex = extension.users.findIndex(u => u.user.toString() === req.params.userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found in extension' });
    }

    extension.metadata.totalCreditsUsed -= extension.users[userIndex].creditsUsed;
    extension.metadata.totalUsers -= 1;
    extension.users.splice(userIndex, 1);
    extension.metadata.lastUpdated = new Date();
    await extension.save();
    
    res.json(extension);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users for an extension (admin only)
router.get('/:id/users', adminAuth, async (req, res) => {
  try {
    const extension = await CheggExtension.findById(req.params.id)
      .populate('users.user', 'email name');
    
    if (!extension) {
      return res.status(404).json({ message: 'Extension not found' });
    }
    
    res.json(extension.users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users and their extensions (admin only)
router.get('/all-users-extensions', adminAuth, async (req, res) => {
  try {
    const extensions = await CheggExtension.find().populate('users.user', 'email name');
    // Build a map: userId -> { email, name, extensions: [{...}] }
    const userMap = {};
    extensions.forEach(ext => {
      ext.users.forEach(u => {
        if (!userMap[u.user._id]) {
          userMap[u.user._id] = {
            email: u.user.email,
            name: u.user.name,
            extensions: []
          };
        }
        userMap[u.user._id].extensions.push({
          extensionName: ext.name,
          creditsUsed: u.creditsUsed,
          status: u.status,
          cheggIdName: u.cheggIdName,
          creditPrice: ext.creditPrice,
          active: ext.active
        });
      });
    });
    // Convert map to array
    const users = Object.entries(userMap).map(([userId, data]) => ({
      userId,
      ...data
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Chat = require('../models/Chat');
const User = require('../models/User');
const { OpenAI } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize AI clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Get all chats for user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id, status: 'active' })
      .sort({ 'metadata.lastActivity': -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new chat
router.post('/', auth, async (req, res) => {
  try {
    const { title, model } = req.body;
    const chat = new Chat({
      user: req.user._id,
      title,
      model,
      messages: []
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific chat
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message to chat
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content,
      model: chat.model,
      timestamp: new Date()
    });

    // Get AI response based on model
    let aiResponse;
    switch (chat.model) {
      case 'gpt-4':
      case 'gpt-3.5-turbo':
        const completion = await openai.chat.completions.create({
          model: chat.model,
          messages: chat.messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        });
        aiResponse = completion.choices[0].message.content;
        break;

      case 'claude-3':
        const claudeResponse = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          messages: chat.messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        });
        aiResponse = claudeResponse.content[0].text;
        break;

      case 'gemini-pro':
        const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const geminiResponse = await geminiModel.generateContent(content);
        aiResponse = geminiResponse.response.text();
        break;

      default:
        throw new Error('Unsupported model');
    }

    // Add AI response
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
      model: chat.model,
      timestamp: new Date()
    });

    // Update chat metadata
    chat.metadata.lastActivity = new Date();
    chat.metadata.totalTokens += 1; // Simplified token counting
    chat.metadata.creditsUsed += 1; // Simplified credit counting

    await chat.save();

    // Update user credits
    const user = await User.findById(req.user._id);
    user.credits -= 1;
    user.usage.totalRequests += 1;
    user.usage.creditsUsed += 1;
    user.usage.lastActive = new Date();
    await user.save();

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete chat
router.delete('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'deleted' },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
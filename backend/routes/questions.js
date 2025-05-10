const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Question = require('../models/Question');
const User = require('../models/User');
const { OpenAI } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize AI clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Get all questions for user
router.get('/', auth, async (req, res) => {
  try {
    const { status, subject, search } = req.query;
    const query = { user: req.user._id };

    if (status) query.status = status;
    if (subject) query.subject = subject;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const questions = await Question.find(query)
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new question
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, subject, source, metadata } = req.body;
    const question = new Question({
      user: req.user._id,
      title,
      content,
      subject,
      source,
      metadata
    });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific question
router.get('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate answer for question
router.post('/:id/answer', auth, async (req, res) => {
  try {
    const { model } = req.body;
    const question = await Question.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check user credits
    const user = await User.findById(req.user._id);
    if (user.credits < 1) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    // Generate answer based on model
    let answer;
    let tokens = 0;
    const startTime = Date.now();

    switch (model) {
      case 'gpt-4':
      case 'gpt-3.5-turbo':
        const completion = await openai.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: 'You are a helpful tutor. Provide detailed, accurate answers.' },
            { role: 'user', content: question.content }
          ]
        });
        answer = completion.choices[0].message.content;
        tokens = completion.usage.total_tokens;
        break;

      case 'claude-3':
        const claudeResponse = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          messages: [
            { role: 'user', content: question.content }
          ]
        });
        answer = claudeResponse.content[0].text;
        tokens = claudeResponse.usage.input_tokens + claudeResponse.usage.output_tokens;
        break;

      case 'gemini-pro':
        const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const geminiResponse = await geminiModel.generateContent(question.content);
        answer = geminiResponse.response.text();
        tokens = 1; // Simplified token counting for Gemini
        break;

      default:
        throw new Error('Unsupported model');
    }

    // Add answer to question
    question.answers.push({
      content: answer,
      model,
      metadata: {
        confidence: 95, // Simplified confidence scoring
        tokens,
        creditsUsed: 1
      }
    });

    // Update question status and metadata
    question.status = 'solved';
    question.metadata.processingTime = Date.now() - startTime;
    question.metadata.creditsUsed += 1;

    await question.save();

    // Update user credits
    user.credits -= 1;
    user.usage.totalRequests += 1;
    user.usage.creditsUsed += 1;
    user.usage.lastActive = new Date();
    await user.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update question status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const question = await Question.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete question
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
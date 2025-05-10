const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const { OpenAI } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize AI clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Get available AI models
router.get('/', auth, async (req, res) => {
  try {
    res.json({ message: 'AI models endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Configure AI model (admin only)
router.post('/configure', adminAuth, async (req, res) => {
  try {
    res.json({ message: 'Configure AI model endpoint' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available models
router.get('/:provider/:modelId', auth, async (req, res) => {
  try {
    const { provider, modelId } = req.params;
    let modelDetails;

    switch (provider) {
      case 'openai':
        const openaiModels = await openai.models.list();
        modelDetails = openaiModels.data.find(m => m.id === modelId);
        break;

      case 'anthropic':
        // Anthropic doesn't provide a models list API
        modelDetails = {
          id: modelId,
          provider: 'anthropic',
          capabilities: ['chat', 'completion']
        };
        break;

      case 'google':
        // Google AI doesn't provide a models list API
        modelDetails = {
          id: modelId,
          provider: 'google',
          capabilities: ['generation', 'chat']
        };
        break;

      default:
        return res.status(400).json({ message: 'Invalid provider' });
    }

    if (!modelDetails) {
      return res.status(404).json({ message: 'Model not found' });
    }

    res.json(modelDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Test model connection (admin only)
router.post('/:provider/:modelId/test', adminAuth, async (req, res) => {
  try {
    const { provider, modelId } = req.params;
    let testResult;

    switch (provider) {
      case 'openai':
        const completion = await openai.chat.completions.create({
          model: modelId,
          messages: [{ role: 'user', content: 'Test connection' }],
          max_tokens: 5
        });
        testResult = {
          success: true,
          response: completion.choices[0].message.content
        };
        break;

      case 'anthropic':
        const claudeResponse = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          messages: [{ role: 'user', content: 'Test connection' }],
          max_tokens: 5
        });
        testResult = {
          success: true,
          response: claudeResponse.content[0].text
        };
        break;

      case 'google':
        const geminiModel = genAI.getGenerativeModel({ model: modelId });
        const geminiResponse = await geminiModel.generateContent('Test connection');
        testResult = {
          success: true,
          response: geminiResponse.response.text()
        };
        break;

      default:
        return res.status(400).json({ message: 'Invalid provider' });
    }

    res.json(testResult);
  } catch (error) {
    res.status(500).json({ 
      message: 'Model test failed',
      error: error.message
    });
  }
});

// Update model settings (admin only)
router.patch('/:provider/:modelId/settings', adminAuth, async (req, res) => {
  try {
    const { provider, modelId } = req.params;
    const { enabled, creditsPerRequest, maxTokens } = req.body;

    // In a real application, you would store these settings in a database
    // For now, we'll just return the updated settings
    const updatedSettings = {
      provider,
      modelId,
      enabled: enabled ?? true,
      creditsPerRequest: creditsPerRequest ?? 1,
      maxTokens: maxTokens ?? 4096,
      updatedAt: new Date()
    };

    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get model usage statistics
router.get('/:provider/:modelId/stats', adminAuth, async (req, res) => {
  try {
    const { provider, modelId } = req.params;
    const { startDate, endDate } = req.query;

    // In a real application, you would query your analytics database
    // For now, we'll return mock statistics
    const stats = {
      provider,
      modelId,
      totalRequests: 1000,
      successRate: 98.5,
      avgResponseTime: 2.5,
      creditsUsed: 2000,
      errors: 15,
      period: {
        start: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: endDate || new Date()
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
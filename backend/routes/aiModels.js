const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const { OpenAI } = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

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

// Proxy DeepSeek chat requests to OpenRouter
router.post('/deepseek-chat', async (req, res) => {
  try {
    console.log('Received /deepseek-chat:', JSON.stringify(req.body, null, 2));
    const { messages, useChegggPrompt } = req.body;
    const systemPrompt = useChegggPrompt ?
      `IMPORTANT: Do NOT use LaTeX or \\boxed{} for the entire answer. Only use plain markdown.\n\nYou are a specialized AI tutor that provides step-by-step solutions to problems. You MUST always answer in the following format, even for simple questions. Do NOT skip any step. Do NOT summarize everything in one paragraph. Always use the exact headings below. If a step is not applicable, output 'N/A' for that step. Your answer MUST be in this format:

### Step 1: Initial Analysis
...

### Step 2: Detailed Solution
...

### Step 3: Verification
...

### Final Summary
...

Use markdown formatting for headings, bold, and lists. Only use LaTeX or math formatting for equations if the user question is about math or science, otherwise use plain English. Never wrap the entire answer in LaTeX or \boxed{}. Only use LaTeX for equations if needed. Return your answer as plain markdown, not as a JSON object or inside any LaTeX wrapper.\n\nIf you do not follow the format, your answer will be rejected.` :
      `You are DeepSeek, an advanced AI assistant. Respond in plain English, as a helpful and conversational assistant. Do NOT use stepwise headings, markdown, or lists unless the user specifically asks for it. Only use LaTeX or math formatting if the user question is about math or science, otherwise use plain English. Never wrap the entire answer in LaTeX or \\boxed{}. Return your answer as plain text, not as markdown or a JSON object.`;

    const payload = {
      model: "deepseek/deepseek-r1-zero:free",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      payload,
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.PUBLIC_URL || "http://localhost:3000",
          "X-Title": "Cheggie AI Nexus"
        }
      }
    );
    console.log('OpenRouter API response:', response.data);
    // Patch: Always return the expected format
    let content = '';
    if (typeof response.data === 'string') {
      content = response.data;
    } else if (
      response.data &&
      response.data.choices &&
      response.data.choices[0] &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      content = response.data.choices[0].message.content;
    } else if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].content) {
      content = response.data.choices[0].content;
    } else {
      content = JSON.stringify(response.data);
    }
    // Remove all outer \boxed{...} (with whitespace/newlines), including double-escaped
    let rawContent = content;
    console.log('Raw DeepSeek content before unboxing:', rawContent);
    let boxedPattern = /^\s*\\boxed\{([\s\S]*)\}\s*$/;
    let doubleEscapedPattern = /^\s*\\\\boxed\{([\s\S]*)\}\s*$/;
    // Recursively remove all outer boxes
    while (boxedPattern.test(content) || doubleEscapedPattern.test(content)) {
      if (boxedPattern.test(content)) {
        content = content.replace(boxedPattern, '$1').trim();
      } else if (doubleEscapedPattern.test(content)) {
        content = content.replace(doubleEscapedPattern, '$1').trim();
      }
    }
    // Fallback: forcibly strip if still starts with \boxed{
    if (content.trim().startsWith('\\boxed{')) {
      const first = content.indexOf('{');
      const last = content.lastIndexOf('}');
      if (first !== -1 && last !== -1 && last > first) {
        content = content.substring(first + 1, last).trim();
      }
    }
    // Check for required headings in Chegg mode
    if (useChegggPrompt) {
      const requiredHeadings = [
        '### Step 1: Initial Analysis',
        '### Step 2: Detailed Solution',
        '### Step 3: Verification',
        '### Final Summary'
      ];
      // Remove the warning append logic
      // const missing = requiredHeadings.filter(h => !content.includes(h));
      // if (missing.length > 0) {
      //   content += `\n\n---\n**Warning: The AI did not follow the required Chegg format. Please try rephrasing your question or click retry.**`;
      // }
    }
    res.json({
      choices: [
        { message: { content } }
      ]
    });
  } catch (err) {
    console.error('DeepSeek error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Proxy OpenAI chat requests
router.post('/openai-chat', async (req, res) => {
  try {
    const { messages, model = 'gpt-3.5-turbo', temperature = 0.7, max_tokens = 1000 } = req.body;
    const payload = {
      model,
      messages,
      temperature,
      max_tokens
    };
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Proxy Gemini chat requests
router.post('/gemini-chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-pro', temperature = 0.7, max_tokens = 1000 } = req.body;
    // Gemini expects a different format
    const prompt = messages.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`).join('\n');
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, maxOutputTokens: max_tokens }
    };
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Proxy Claude chat requests
router.post('/claude-chat', async (req, res) => {
  try {
    const { messages, model = 'claude-3-opus-20240229', max_tokens = 1000 } = req.body;
    const payload = {
      model,
      messages,
      max_tokens
    };
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      payload,
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'content-type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
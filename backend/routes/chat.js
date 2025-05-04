const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8008/generate';

// POST /api/chat
router.post('/', async (req, res) => {
  const { message, context } = req.body;
  
  // Format prompt for the AI model
  const prompt = `${context ? context + '\n' : ''}User: ${message}\nAI: `;
  
  try {
    // Call the Python AI service
    const aiResponse = await fetch(AI_SERVICE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, max_tokens: 256 })
    });
    
    if (!aiResponse.ok) {
      throw new Error(`AI service returned ${aiResponse.status}`);
    }
    
    const data = await aiResponse.json();
    
    // Use the AI response or fallback to a default message
    res.json({ response: data.response || `AI says: ${message}` });
  } catch (error) {
    console.error('Error calling AI service:', error);
    // Provide a fallback response if the AI service fails
    res.json({ response: `Sorry, I couldn't process that right now. (Error: ${error.message})` });
  }
});

module.exports = router;

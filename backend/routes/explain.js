const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8008/generate';

// POST /api/explain
router.post('/', async (req, res) => {
  const { text, context } = req.body;
  
  // Format prompt for the AI model to generate an explanation
  const prompt = `${context ? context + '\n' : ''}Please explain the following text in clear terms:\n\n"${text}"\n\nExplanation: `;
  
  try {
    // Call the Python AI service
    const aiResponse = await fetch(AI_SERVICE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, max_tokens: 512 })
    });
    
    if (!aiResponse.ok) {
      throw new Error(`AI service returned ${aiResponse.status}`);
    }
    
    const data = await aiResponse.json();
    
    // Use the AI-generated explanation or fallback
    res.json({ explanation: data.response || `Explanation for: ${text}` });
  } catch (error) {
    console.error('Error calling AI service for explanation:', error);
    // Provide a fallback explanation if the AI service fails
    res.json({ explanation: `I couldn't generate an explanation right now. Please try again later.` });
  }
});

module.exports = router;

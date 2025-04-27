const fetch = require('node-fetch');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function gradeAnswer({ question, userAnswer, rubric }) {
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured on server.');

  // Compose grading prompt
  const prompt = `You are an expert educator. Grade the following student answer according to the rubric. Provide a numeric score (0-5) and concise feedback.\n\nQuestion: ${question}\n\nStudent Answer: ${userAnswer}\n\nRubric: ${rubric}\n\nRespond in JSON: { "score": <number>, "feedback": <string> }`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${err}`);
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  let score = null, feedback = '';
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const obj = JSON.parse(match[0]);
      score = obj.score;
      feedback = obj.feedback;
    }
  } catch (e) {
    feedback = text.trim();
  }
  if (score == null) score = '';
  return { score, feedback };
}

module.exports = { gradeAnswer };

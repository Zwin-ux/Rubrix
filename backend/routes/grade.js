const express = require('express');
const router = express.Router();
const { gradeAnswer } = require('../services/aiGrader');

// POST /api/grade
router.post('/', async (req, res) => {
  const { question, userAnswer, rubric } = req.body;
  try {
    const result = await gradeAnswer({ question, userAnswer, rubric });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: `Gemini grading failed: ${err.message}` });
  }
});

module.exports = router;

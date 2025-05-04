const express = require('express');
const router = express.Router();

// POST /api/analytics
router.post('/', async (req, res) => {
  const { event, data } = req.body;
  // TODO: Log analytics event to DB or file
  res.json({ status: 'ok', received: { event, data } });
});

module.exports = router;

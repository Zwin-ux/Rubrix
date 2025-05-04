const express = require('express');
const cors = require('cors');
const gradeRoute = require('./routes/grade');
const chatRoute = require('./routes/chat');
const explainRoute = require('./routes/explain');
const analyticsRoute = require('./routes/analytics');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/grade', gradeRoute);
app.use('/api/chat', chatRoute);
app.use('/api/explain', explainRoute);
app.use('/api/analytics', analyticsRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

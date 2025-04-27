const express = require('express');
const cors = require('cors');
const gradeRoute = require('./routes/grade');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/grade', gradeRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

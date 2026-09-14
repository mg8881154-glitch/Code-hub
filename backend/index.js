const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB, isDBConnected, getFallbackStore } = require('./db');
const Problem = require('./models/Problem');

const app = express();
app.use(cors());
app.use(express.json());

// Resilient DB initialization with auto-seeding
initDB();

// Mount Modular Routes
const { router: authRouter } = require('./routes/auth');
const problemsRouter = require('./routes/problems');
const userRouter = require('./routes/user');
const apiRouter = require('./routes/api');
const aiRouter = require('./routes/ai');

app.use('/', authRouter);
app.use('/problems', problemsRouter);
app.use('/user', userRouter);
app.use('/api', apiRouter);
app.use('/ai', aiRouter);

// Daily Challenge Route
app.get('/daily-challenge', async (req, res) => {
  try {
    let list = [];
    if (isDBConnected()) {
      list = await Problem.find();
    } else {
      list = getFallbackStore().problems || [];
    }
    if (list.length === 0) return res.status(404).json({ message: 'No problems found' });
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % list.length;
    res.json(list[index]);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch daily challenge' });
  }
});

// Root Health Route
app.get('/', (req, res) => {
  res.json({
    message: 'CodeHub API running ✅',
    dbConnected: isDBConnected(),
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CodeHub API running on port ${PORT}`);
});
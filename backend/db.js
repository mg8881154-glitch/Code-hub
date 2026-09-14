const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const Problem = require('./models/Problem');
const User = require('./models/User');
const UserData = require('./models/UserData');

const seedData = require('./seedData.json');

let isConnected = false;

async function initDB() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codehub';
  console.log('Connecting to MongoDB Atlas / URI...');
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3500 });
    isConnected = true;
    console.log('✅ MongoDB Connected successfully!');
    await seedProblemsIfEmpty();
  } catch (err) {
    console.warn('⚠️ MongoDB Atlas connection warning:', err.message);
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/codehub', { serverSelectionTimeoutMS: 2000 });
      isConnected = true;
      console.log('✅ Local MongoDB Connected!');
      await seedProblemsIfEmpty();
    } catch (localErr) {
      console.log('🔄 Running in Resilient Fallback Mode (Full Offline & Local Reliability)');
      isConnected = false;
      initFallbackData();
    }
  }
}

async function seedProblemsIfEmpty() {
  try {
    const count = await Problem.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding database with ' + seedData.length + ' problems...');
      await Problem.insertMany(seedData);
      console.log('✅ Seed complete!');
    } else {
      console.log('ℹ️ Database has ' + count + ' problems.');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}

const fallbackFilePath = path.join(__dirname, 'local_db.json');
let fallbackStore = {
  users: [
    {
      _id: 'user_admin_1',
      username: 'AlexDev',
      email: 'alex@codehub.dev',
      passwordHash: bcrypt.hashSync('password123', 10),
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  ],
  problems: seedData.map((p, idx) => ({ ...p, _id: 'prob_' + (idx + 1) })),
  userData: {
    'user_admin_1': {
      userId: 'user_admin_1',
      bookmarks: ['prob_1', 'prob_2'],
      notes: [{ problemId: 'prob_1', note: 'Use Map for O(n) optimal single pass', updatedAt: new Date().toISOString() }],
      solvedProblems: ['prob_1', 'prob_2', 'prob_4'],
      easyCount: 3,
      mediumCount: 0,
      hardCount: 0,
      badges: [
        { id: 'first_solve', name: 'First Blood', icon: '🩸', description: 'Solved your first problem!', earnedAt: new Date().toISOString() },
        { id: 'streak_3', name: 'On Fire', icon: '🔥', description: '3 day solving streak!', earnedAt: new Date().toISOString() }
      ],
      streak: 3,
      lastSolvedDate: new Date().toISOString()
    }
  },
  submissions: [
    {
      _id: 'sub_1',
      userId: 'user_admin_1',
      problemId: 'prob_1',
      problemTitle: 'Two Sum',
      difficulty: 'Easy',
      code: 'function twoSum(nums, target) { return [0, 1]; }',
      language: 'JavaScript',
      status: 'Accepted',
      runtime: '62ms',
      memory: '42.1MB',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  messages: [
    {
      _id: 'msg_1',
      userId: 'user_admin_1',
      username: 'AlexDev',
      problemId: 'prob_1',
      text: 'Great problem for HashMap practice! Remember to handle duplicates.',
      likes: 3,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ]
};

function loadFallbackFile() {
  if (fs.existsSync(fallbackFilePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(fallbackFilePath, 'utf8'));
      fallbackStore = { ...fallbackStore, ...data };
      if (!fallbackStore.problems || fallbackStore.problems.length === 0) {
        fallbackStore.problems = seedData.map((p, idx) => ({ ...p, _id: 'prob_' + (idx + 1) }));
      }
    } catch (e) {
      console.error('Error reading fallback store:', e.message);
    }
  }
}

function saveFallbackFile() {
  try {
    fs.writeFileSync(fallbackFilePath, JSON.stringify(fallbackStore, null, 2));
  } catch (e) {
    console.error('Error writing fallback store:', e.message);
  }
}

function initFallbackData() {
  loadFallbackFile();
  if (!fallbackStore.problems || fallbackStore.problems.length === 0) {
    fallbackStore.problems = seedData.map((p, idx) => ({ ...p, _id: 'prob_' + (idx + 1) }));
  }
  saveFallbackFile();
}

module.exports = {
  initDB,
  isDBConnected: () => isConnected,
  getFallbackStore: () => fallbackStore,
  saveFallbackStore: saveFallbackFile,
  seedData
};

const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const UserData = require('../models/UserData');
const { isDBConnected, getFallbackStore, saveFallbackStore } = require('../db');
const { protect } = require('./auth');

const BADGES = [
  { id: 'first_solve', name: 'First Blood', icon: '🩸', description: 'Solved your first problem!' },
  { id: 'easy_5', name: 'Warm Up', icon: '🔥', description: 'Solved 5 Easy problems' },
  { id: 'easy_20', name: 'Easy Rider', icon: '🚀', description: 'Solved 20 Easy problems' },
  { id: 'medium_5', name: 'Getting Serious', icon: '💪', description: 'Solved 5 Medium problems' },
  { id: 'medium_20', name: 'Problem Crusher', icon: '⚡', description: 'Solved 20 Medium problems' },
  { id: 'hard_1', name: 'Hard Mode', icon: '💎', description: 'Solved your first Hard problem!' },
  { id: 'hard_10', name: 'Elite Coder', icon: '👑', description: 'Solved 10 Hard problems' },
  { id: 'streak_3', name: 'On Fire', icon: '🔥', description: '3 day solving streak!' },
  { id: 'streak_7', name: 'Week Warrior', icon: '🗓', description: '7 day solving streak!' },
  { id: 'streak_30', name: 'Monthly Master', icon: '🏆', description: '30 day solving streak!' },
  { id: 'bookmark_10', name: 'Bookworm', icon: '📚', description: 'Bookmarked 10 problems' },
  { id: 'total_50', name: 'Half Century', icon: '🎯', description: 'Solved 50 problems total!' },
  { id: 'total_100', name: 'Centurion', icon: '💯', description: 'Solved 100 problems total!' },
];

function checkAndAwardBadges(userData) {
  const earned = (userData.badges || []).map(b => b.id);
  const newBadges = [];
  const solved = (userData.solvedProblems || []).length;
  const easy = userData.easyCount || 0;
  const medium = userData.mediumCount || 0;
  const hard = userData.hardCount || 0;
  const streak = userData.streak || 0;
  const bookmarks = (userData.bookmarks || []).length;

  const checks = [
    { id: 'first_solve', condition: solved >= 1 },
    { id: 'easy_5', condition: easy >= 5 },
    { id: 'easy_20', condition: easy >= 20 },
    { id: 'medium_5', condition: medium >= 5 },
    { id: 'medium_20', condition: medium >= 20 },
    { id: 'hard_1', condition: hard >= 1 },
    { id: 'hard_10', condition: hard >= 10 },
    { id: 'streak_3', condition: streak >= 3 },
    { id: 'streak_7', condition: streak >= 7 },
    { id: 'streak_30', condition: streak >= 30 },
    { id: 'bookmark_10', condition: bookmarks >= 10 },
    { id: 'total_50', condition: solved >= 50 },
    { id: 'total_100', condition: solved >= 100 },
  ];

  for (const check of checks) {
    if (check.condition && !earned.includes(check.id)) {
      const badge = BADGES.find(b => b.id === check.id);
      if (badge) newBadges.push({ ...badge, earnedAt: new Date().toISOString() });
    }
  }
  return newBadges;
}

// Bookmark toggle
router.post('/bookmark/:problemId', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId } = req.params;

    if (isDBConnected()) {
      let userData = await UserData.findOne({ userId });
      if (!userData) userData = new UserData({ userId });
      const idx = userData.bookmarks.indexOf(problemId);
      if (idx === -1) userData.bookmarks.push(problemId);
      else userData.bookmarks.splice(idx, 1);
      const newBadges = checkAndAwardBadges(userData);
      if (newBadges.length) userData.badges.push(...newBadges);
      await userData.save();
      return res.json({ bookmarks: userData.bookmarks, newBadges });
    }

    const store = getFallbackStore();
    if (!store.userData[userId]) {
      store.userData[userId] = { userId, bookmarks: [], notes: [], solvedProblems: [], badges: [], streak: 0 };
    }
    const uData = store.userData[userId];
    const bIndex = uData.bookmarks.indexOf(problemId);
    if (bIndex === -1) uData.bookmarks.push(problemId);
    else uData.bookmarks.splice(bIndex, 1);
    const newBadges = checkAndAwardBadges(uData);
    if (newBadges.length) uData.badges.push(...newBadges);
    saveFallbackStore();
    res.json({ bookmarks: uData.bookmarks, newBadges });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/bookmarks', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    if (isDBConnected()) {
      const userData = await UserData.findOne({ userId }).populate('bookmarks');
      return res.json(userData?.bookmarks || []);
    }
    const store = getFallbackStore();
    const uData = store.userData[userId];
    if (!uData || !uData.bookmarks) return res.json([]);
    const populated = uData.bookmarks.map(bId => store.problems.find(p => p._id.toString() === bId.toString())).filter(Boolean);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notes
router.post('/note/:problemId', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId } = req.params;
    const { note } = req.body;

    if (isDBConnected()) {
      let userData = await UserData.findOne({ userId });
      if (!userData) userData = new UserData({ userId });
      const existing = userData.notes.find(n => n.problemId?.toString() === problemId);
      if (existing) {
        existing.note = note;
        existing.updatedAt = new Date();
      } else {
        userData.notes.push({ problemId, note });
      }
      await userData.save();
      return res.json({ success: true });
    }

    const store = getFallbackStore();
    if (!store.userData[userId]) {
      store.userData[userId] = { userId, bookmarks: [], notes: [], solvedProblems: [], badges: [], streak: 0 };
    }
    const uData = store.userData[userId];
    const existing = uData.notes.find(n => n.problemId.toString() === problemId.toString());
    if (existing) {
      existing.note = note;
      existing.updatedAt = new Date().toISOString();
    } else {
      uData.notes.push({ problemId, note, updatedAt: new Date().toISOString() });
    }
    saveFallbackStore();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/note/:problemId', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId } = req.params;
    if (isDBConnected()) {
      const userData = await UserData.findOne({ userId });
      const note = userData?.notes.find(n => n.problemId?.toString() === problemId);
      return res.json({ note: note?.note || '' });
    }
    const store = getFallbackStore();
    const uData = store.userData[userId];
    const note = uData?.notes?.find(n => n.problemId.toString() === problemId.toString());
    res.json({ note: note?.note || '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Solve & Streak
router.post('/solve/:problemId', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId } = req.params;

    if (isDBConnected()) {
      let userData = await UserData.findOne({ userId });
      if (!userData) userData = new UserData({ userId });
      if (!userData.solvedProblems.map(s => s.toString()).includes(problemId.toString())) {
        userData.solvedProblems.push(problemId);
      }
      const today = new Date(); today.setHours(0,0,0,0);
      const last = userData.lastSolvedDate ? new Date(userData.lastSolvedDate) : null;
      if (last) last.setHours(0,0,0,0);
      const diff = last ? (today - last) / (1000*60*60*24) : null;
      if (!last || diff > 1) userData.streak = 1;
      else if (diff === 1) userData.streak += 1;
      userData.lastSolvedDate = new Date();

      const allSolved = await Problem.find({ _id: { $in: userData.solvedProblems } });
      userData.easyCount = allSolved.filter(p => p.difficulty === 'Easy').length;
      userData.mediumCount = allSolved.filter(p => p.difficulty === 'Medium').length;
      userData.hardCount = allSolved.filter(p => p.difficulty === 'Hard').length;

      const newBadges = checkAndAwardBadges(userData);
      if (newBadges.length) userData.badges.push(...newBadges);
      await userData.save();
      return res.json({
        solved: userData.solvedProblems.length,
        streak: userData.streak,
        newBadges,
        badges: userData.badges,
        easyCount: userData.easyCount,
        mediumCount: userData.mediumCount,
        hardCount: userData.hardCount
      });
    }

    const store = getFallbackStore();
    if (!store.userData[userId]) {
      store.userData[userId] = {
        userId,
        bookmarks: [],
        notes: [],
        solvedProblems: [],
        easyCount: 0,
        mediumCount: 0,
        hardCount: 0,
        badges: [],
        streak: 0,
        lastSolvedDate: null
      };
    }
    const uData = store.userData[userId];
    if (!uData.solvedProblems.map(s => s.toString()).includes(problemId.toString())) {
      uData.solvedProblems.push(problemId);
    }
    const today = new Date(); today.setHours(0,0,0,0);
    const last = uData.lastSolvedDate ? new Date(uData.lastSolvedDate) : null;
    if (last) last.setHours(0,0,0,0);
    const diff = last ? (today - last) / (1000*60*60*24) : null;
    if (!last || diff > 1) uData.streak = 1;
    else if (diff === 1) uData.streak += 1;
    uData.lastSolvedDate = new Date().toISOString();

    const solvedList = store.problems.filter(p => uData.solvedProblems.map(s => s.toString()).includes(p._id.toString()));
    uData.easyCount = solvedList.filter(p => p.difficulty === 'Easy').length;
    uData.mediumCount = solvedList.filter(p => p.difficulty === 'Medium').length;
    uData.hardCount = solvedList.filter(p => p.difficulty === 'Hard').length;

    const newBadges = checkAndAwardBadges(uData);
    if (newBadges.length) uData.badges.push(...newBadges);
    saveFallbackStore();
    res.json({
      solved: uData.solvedProblems.length,
      streak: uData.streak,
      newBadges,
      badges: uData.badges,
      easyCount: uData.easyCount,
      mediumCount: uData.mediumCount,
      hardCount: uData.hardCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/badges', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    let earnedBadges = [];
    if (isDBConnected()) {
      const userData = await UserData.findOne({ userId });
      earnedBadges = userData?.badges || [];
    } else {
      const store = getFallbackStore();
      earnedBadges = store.userData[userId]?.badges || [];
    }
    res.json({ badges: earnedBadges, allBadges: BADGES });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    if (isDBConnected()) {
      const userData = await UserData.findOne({ userId });
      return res.json({
        solved: userData?.solvedProblems?.length || 0,
        streak: userData?.streak || 0,
        badges: userData?.badges || [],
        bookmarks: userData?.bookmarks?.length || 0,
        easyCount: userData?.easyCount || 0,
        mediumCount: userData?.mediumCount || 0,
        hardCount: userData?.hardCount || 0,
      });
    }
    const store = getFallbackStore();
    const uData = store.userData[userId] || {};
    res.json({
      solved: uData.solvedProblems?.length || 0,
      streak: uData.streak || 0,
      badges: uData.badges || [],
      bookmarks: uData.bookmarks?.length || 0,
      easyCount: uData.easyCount || 0,
      mediumCount: uData.mediumCount || 0,
      hardCount: uData.hardCount || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Problem = require('../models/Problem');
const { isDBConnected, getFallbackStore, saveFallbackStore } = require('../db');
const { protect, adminOnly } = require('./auth');

router.get('/', async (req, res) => {
  try {
    if (isDBConnected()) {
      const problems = await Problem.find().sort({ createdAt: 1 });
      return res.json(problems);
    }
    const store = getFallbackStore();
    res.json(store.problems || []);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching problems', details: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q = '', difficulty, tag, source } = req.query;
    if (isDBConnected()) {
      const filter = {};
      if (q) filter.title = { $regex: q, $options: 'i' };
      if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
      if (tag && tag !== 'All') filter.tags = { $in: [tag] };
      if (source && source !== 'All') filter.source = source;
      const problems = await Problem.find(filter).limit(100);
      return res.json(problems);
    }

    const store = getFallbackStore();
    let result = store.problems || [];
    if (q) {
      const lower = q.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower));
    }
    if (difficulty && difficulty !== 'All') {
      result = result.filter(p => p.difficulty === difficulty);
    }
    if (tag && tag !== 'All') {
      result = result.filter(p => p.tags && p.tags.includes(tag));
    }
    if (source && source !== 'All') {
      result = result.filter(p => p.source === source);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isDBConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const problem = await Problem.findById(id);
      if (problem) return res.json(problem);
    }
    const store = getFallbackStore();
    const problem = store.problems.find(p => p._id.toString() === id.toString() || p.title.toLowerCase() === id.toLowerCase());
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    if (isDBConnected()) {
      const problem = new Problem(req.body);
      await problem.save();
      return res.status(201).json(problem);
    }
    const store = getFallbackStore();
    const newProb = { ...req.body, _id: 'prob_' + (store.problems.length + 1), createdAt: new Date().toISOString() };
    store.problems.push(newProb);
    saveFallbackStore();
    res.status(201).json(newProb);
  } catch (err) {
    res.status(500).json({ error: 'Error creating problem' });
  }
});

module.exports = router;

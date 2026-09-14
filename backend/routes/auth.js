const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { isDBConnected, getFallbackStore, saveFallbackStore } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'codehub_super_secret_jwt_key_2026_dev';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No token, unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const optionalProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {}
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

const generateToken = (user) => jwt.sign(
  { id: user._id || user.id, email: user.email, role: user.role, username: user.username },
  JWT_SECRET,
  { expiresIn: '7d' }
);

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    const cleanEmail = email.toLowerCase().trim();

    if (isDBConnected()) {
      const exists = await User.findOne({ email: cleanEmail });
      if (exists) return res.status(400).json({ message: 'Email already registered' });
      const user = new User({ username: username.trim(), email: cleanEmail, password, role: role || 'user' });
      await user.save();
      const token = generateToken(user);
      return res.status(201).json({
        token,
        user: { id: user._id, username: user.username, email: user.email, role: user.role }
      });
    }

    const store = getFallbackStore();
    if (store.users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const newUser = {
      _id: 'user_' + Date.now(),
      username: username.trim(),
      email: cleanEmail,
      passwordHash: bcrypt.hashSync(password, 10),
      role: role || 'user',
      createdAt: new Date().toISOString()
    };
    store.users.push(newUser);
    store.userData[newUser._id] = {
      userId: newUser._id,
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
    saveFallbackStore();
    const token = generateToken(newUser);
    res.status(201).json({
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });
    const cleanEmail = email.toLowerCase().trim();

    if (isDBConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
      const token = generateToken(user);
      return res.json({
        token,
        user: { id: user._id, username: user.username, email: user.email, role: user.role }
      });
    }

    const store = getFallbackStore();
    const user = store.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', protect, async (req, res) => {
  try {
    if (isDBConnected()) {
      const user = await User.findById(req.user.id).select('-password');
      return res.json(user);
    }
    const store = getFallbackStore();
    const user = store.users.find(u => u._id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { passwordHash, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

router.get('/admin/users', protect, adminOnly, async (req, res) => {
  try {
    if (isDBConnected()) {
      const users = await User.find().select('-password');
      return res.json(users);
    }
    const store = getFallbackStore();
    res.json(store.users.map(({ passwordHash, ...u }) => u));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

module.exports = { router, protect, optionalProtect, adminOnly, JWT_SECRET };

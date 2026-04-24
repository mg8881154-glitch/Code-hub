const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();   // .env read karega

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const User = require("./models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ── JWT Middleware ──
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token, unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};

const generateToken = (user) => jwt.sign(
  { id: user._id, email: user.email, role: user.role, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

// Test route
app.get("/", (req, res) => res.json({ message: "CodeHub API running ✅" }));

// ── Auth Routes ──
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });
    const user = new User({ username, email, password, role: role || "user" });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

app.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

app.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Admin only route
app.get("/admin/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

const Problem = require("./models/Problem");
const UserData = require("./models/UserData");
const Groq = require("groq-sdk");

// ── Badge definitions ──
const BADGES = [
  { id: "first_solve", name: "First Blood", icon: "🩸", description: "Solved your first problem!" },
  { id: "easy_5", name: "Warm Up", icon: "🔥", description: "Solved 5 Easy problems" },
  { id: "easy_20", name: "Easy Rider", icon: "🚀", description: "Solved 20 Easy problems" },
  { id: "medium_5", name: "Getting Serious", icon: "💪", description: "Solved 5 Medium problems" },
  { id: "medium_20", name: "Problem Crusher", icon: "⚡", description: "Solved 20 Medium problems" },
  { id: "hard_1", name: "Hard Mode", icon: "💎", description: "Solved your first Hard problem!" },
  { id: "hard_10", name: "Elite Coder", icon: "👑", description: "Solved 10 Hard problems" },
  { id: "streak_3", name: "On Fire", icon: "🔥", description: "3 day solving streak!" },
  { id: "streak_7", name: "Week Warrior", icon: "🗓", description: "7 day solving streak!" },
  { id: "streak_30", name: "Monthly Master", icon: "🏆", description: "30 day solving streak!" },
  { id: "bookmark_10", name: "Bookworm", icon: "📚", description: "Bookmarked 10 problems" },
  { id: "total_50", name: "Half Century", icon: "🎯", description: "Solved 50 problems total!" },
  { id: "total_100", name: "Centurion", icon: "💯", description: "Solved 100 problems total!" },
];

async function checkAndAwardBadges(userData) {
  const earned = userData.badges.map(b => b.id);
  const newBadges = [];
  const solved = userData.solvedProblems.length;

  const checks = [
    { id: "first_solve", condition: solved >= 1 },
    { id: "easy_5", condition: userData.easyCount >= 5 },
    { id: "easy_20", condition: userData.easyCount >= 20 },
    { id: "medium_5", condition: userData.mediumCount >= 5 },
    { id: "medium_20", condition: userData.mediumCount >= 20 },
    { id: "hard_1", condition: userData.hardCount >= 1 },
    { id: "hard_10", condition: userData.hardCount >= 10 },
    { id: "streak_3", condition: userData.streak >= 3 },
    { id: "streak_7", condition: userData.streak >= 7 },
    { id: "streak_30", condition: userData.streak >= 30 },
    { id: "bookmark_10", condition: userData.bookmarks.length >= 10 },
    { id: "total_50", condition: solved >= 50 },
    { id: "total_100", condition: solved >= 100 },
  ];

  for (const check of checks) {
    if (check.condition && !earned.includes(check.id)) {
      const badge = BADGES.find(b => b.id === check.id);
      if (badge) newBadges.push({ ...badge, earnedAt: new Date() });
    }
  }
  return newBadges;
}

// ── Bookmark Routes ──
app.post("/user/:userId/bookmark/:problemId", async (req, res) => {
  try {
    const { userId, problemId } = req.params;
    let userData = await UserData.findOne({ userId });
    if (!userData) userData = new UserData({ userId });
    const idx = userData.bookmarks.indexOf(problemId);
    if (idx === -1) {
      userData.bookmarks.push(problemId);
    } else {
      userData.bookmarks.splice(idx, 1);
    }
    const newBadges = await checkAndAwardBadges(userData);
    userData.badges.push(...newBadges);
    await userData.save();
    res.json({ bookmarks: userData.bookmarks, newBadges });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/user/:userId/bookmarks", async (req, res) => {
  try {
    const userData = await UserData.findOne({ userId: req.params.userId }).populate("bookmarks");
    res.json(userData?.bookmarks || []);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Notes Routes ──
app.post("/user/:userId/note/:problemId", async (req, res) => {
  try {
    const { userId, problemId } = req.params;
    const { note } = req.body;
    let userData = await UserData.findOne({ userId });
    if (!userData) userData = new UserData({ userId });
    const existing = userData.notes.find(n => n.problemId.toString() === problemId);
    if (existing) { existing.note = note; existing.updatedAt = new Date(); }
    else userData.notes.push({ problemId, note });
    await userData.save();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/user/:userId/note/:problemId", async (req, res) => {
  try {
    const userData = await UserData.findOne({ userId: req.params.userId });
    const note = userData?.notes.find(n => n.problemId.toString() === req.params.problemId);
    res.json({ note: note?.note || "" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Solve + Badge Routes ──
app.post("/user/:userId/solve/:problemId", async (req, res) => {
  try {
    const { userId, problemId } = req.params;
    const problem = await Problem.findById(problemId);
    let userData = await UserData.findOne({ userId });
    if (!userData) userData = new UserData({ userId });
    if (!userData.solvedProblems.includes(problemId)) {
      userData.solvedProblems.push(problemId);
    }
    // Update streak
    const today = new Date(); today.setHours(0,0,0,0);
    const last = userData.lastSolvedDate ? new Date(userData.lastSolvedDate) : null;
    if (last) { last.setHours(0,0,0,0); }
    const diff = last ? (today - last) / (1000*60*60*24) : null;
    if (!last || diff > 1) userData.streak = 1;
    else if (diff === 1) userData.streak += 1;
    userData.lastSolvedDate = new Date();
    // Count by difficulty
    const allSolved = await Problem.find({ _id: { $in: userData.solvedProblems } });
    userData.easyCount = allSolved.filter(p => p.difficulty === "Easy").length;
    userData.mediumCount = allSolved.filter(p => p.difficulty === "Medium").length;
    userData.hardCount = allSolved.filter(p => p.difficulty === "Hard").length;
    const newBadges = await checkAndAwardBadges(userData);
    userData.badges.push(...newBadges);
    await userData.save();
    res.json({ solved: userData.solvedProblems.length, streak: userData.streak, newBadges, badges: userData.badges });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/user/:userId/badges", async (req, res) => {
  try {
    const userData = await UserData.findOne({ userId: req.params.userId });
    res.json({ badges: userData?.badges || [], allBadges: BADGES });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/user/:userId/stats", async (req, res) => {
  try {
    const userData = await UserData.findOne({ userId: req.params.userId });
    res.json({
      solved: userData?.solvedProblems?.length || 0,
      streak: userData?.streak || 0,
      badges: userData?.badges || [],
      bookmarks: userData?.bookmarks?.length || 0,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// AI Chat route
app.post("/ai/chat", async (req, res) => {
  try {
    const { message, problemTitle, problemDescription } = req.body;

    const { language = "English" } = req.body;

    const langInstruction = language === "Hindi"
      ? "Always respond in Hindi (Devanagari script)."
      : language === "Hinglish"
      ? "Always respond in Hinglish (mix of Hindi and English, written in Roman/English script). Like: 'Is problem mein hum ek HashMap use karenge'."
      : language === "Tamil"
      ? "Always respond in Tamil language."
      : language === "Telugu"
      ? "Always respond in Telugu language."
      : language === "Bengali"
      ? "Always respond in Bengali language."
      : "Always respond in English.";

    const systemPrompt = problemTitle
      ? `You are a helpful DSA assistant for CodeHub platform. ${langInstruction} The user is solving: "${problemTitle}". Description: ${problemDescription}. Help them with hints, approach, and concepts. Do NOT give direct code. Be concise and clear.`
      : `You are a helpful DSA assistant for CodeHub coding platform. ${langInstruction} Help users understand data structures, algorithms, time complexity, and problem-solving. Be concise and clear.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ reply: "Sorry, AI is unavailable right now. Please try again." });
  }
});

const Message = require("./models/Message");

// ── Discussion / Chat Routes ──
app.post("/api/message", async (req, res) => {
  try {
    const { userId, username, problemId, text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Message cannot be empty" });
    const message = await Message.create({ userId, username, problemId, text });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

app.get("/api/message/:problemId", async (req, res) => {
  try {
    const messages = await Message.find({ problemId: req.params.problemId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

app.delete("/api/message/:messageId", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.messageId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message" });
  }
});
// AI Mock Interview route
app.post("/ai/interview", async (req, res) => {
  try {
    const { message, history, problem } = req.body;
    const systemPrompt = `You are Alex, an expert Senior Software Engineer and Technical Interviewer at Google with 10+ years of experience. You are conducting a real technical interview.

Problem: "${problem?.title || 'Two Sum'}"
Description: "${problem?.description || 'Find two numbers that add up to target'}"
Difficulty: ${problem?.difficulty || 'Medium'}

STRICT BEHAVIORAL RULES:
1. INTRODUCTION: Greet warmly as Alex from Google. Introduce yourself and the problem briefly.
2. CLARIFICATION PHASE: Ask candidate for clarifying questions. If none, prompt: "Before we dive in, any questions about constraints or edge cases?"
3. APPROACH GATE (CRITICAL): The candidate MUST verbally explain their optimal approach before writing ANY code. Explicitly say: "Great, before you start coding, walk me through your approach." Do NOT allow coding until you confirm: "Your approach sounds correct. Go ahead and implement it."
4. COMPLEXITY CHECK: If candidate proposes O(n²) for Two Sum, say exactly: "I see your solution, but it might exceed the time limit for larger inputs. Can we achieve this in a single pass?"
5. CODING PHASE: Once approach approved, let them code. Ask about edge cases: null input, empty array, duplicates.
6. END INTERVIEW: When user says "I have submitted my code" or "done", give structured feedback on THREE pillars:
   - Technical: Code correctness, complexity, edge cases
   - Communication: Clarity of explanation, asking good questions
   - Logical Reasoning: Problem decomposition, optimization thinking
   Then give final verdict: "HIRE" or "NO HIRE" with brief justification.
7. RESPONSE LENGTH: Keep responses 2-3 sentences MAX. This is voice-optimized.
8. TONE: Professional, encouraging but rigorous. Use "Walk me through...", "How would you handle...", "What's the time complexity of..."`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message }
      ],
      max_tokens: 250,
      temperature: 0.7,
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ reply: "Interview session error. Please try again." });
  }
});

app.get("/daily-challenge", async (req, res) => {
  try {
    const count = await Problem.countDocuments();
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % count;
    const problem = await Problem.findOne().skip(index);
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch daily challenge" });
  }
});

// Get all problems
app.get("/problems", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    res.status(500).send("Error fetching problems");
  }
});

// Add a problem
app.post("/problems", async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    res.status(500).send("Error creating problem");
  }
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
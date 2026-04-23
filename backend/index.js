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

// Test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User created");
  } catch (err) {
    res.status(500).send("Error creating user");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).send("Invalid email or password");
    res.send("Login successful");
  } catch (err) {
    res.status(500).send("Error logging in");
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

// Daily Challenge route
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
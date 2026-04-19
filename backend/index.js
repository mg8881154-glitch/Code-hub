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
const Groq = require("groq-sdk");
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
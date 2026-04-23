const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
  notes: [{
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
    note: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now }
  }],
  solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
  badges: [{
    id: String,
    name: String,
    icon: String,
    description: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  streak: { type: Number, default: 0 },
  lastSolvedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("UserData", userDataSchema);

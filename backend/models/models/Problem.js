const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  source: { type: String, default: "LeetCode" },
  timeComplexity: { type: String, default: "O(n)" },
  spaceComplexity: { type: String, default: "O(1)" },
  hint: { type: String, default: "" },
  approach: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Problem", problemSchema);

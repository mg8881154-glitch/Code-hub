const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
  text: { type: String, required: true, trim: true },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);

const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: Array,
    required: true,
  },
});

exports.Question = mongoose.model("Question", questionsSchema);
exports.questionsSchema = questionsSchema;

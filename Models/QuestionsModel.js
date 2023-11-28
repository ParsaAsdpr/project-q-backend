const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({
  title: {
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
  follower: {
    type: Number,
    default: 0,
  },
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      default: null,
    },
  ],
});

exports.Question = mongoose.model("Question", questionsSchema);
exports.questionsSchema = questionsSchema;

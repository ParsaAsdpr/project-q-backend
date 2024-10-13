import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
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
  upvotes: {
    type: Number,
    default: 0,
  },
  downvotes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Array,
    default: [],
  },
  shareCount: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
});

exports.Answers = mongoose.model("Answers", answerSchema);
exports.answersSchema = answerSchema;

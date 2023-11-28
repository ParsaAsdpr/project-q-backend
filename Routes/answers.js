const express = require("express");
const { Answer } = require("../Models/answersModel");
const { default: mongoose } = require("mongoose");
const auth = require("../utils/Middleware/auth");
const checkUserBody = require("../utils/Middleware/checkUserBody");
const {validateAnswer} = require("../utils/Middleware/validations/validateAnswer");

const router = express.Router();

router.get("/", async (req, res) => {
  const answers = await Answer.find().populate("user_id", "profile").populate("question_id", "title");
  if (!answers) return res.status(404).send("Answers not found");
  if (answers.length < 1) return res.status(404).send("Answers not found");
  res.send(answers);
});
router.get("/:id", async (req, res) => {
  const answer = await Answer.findById(req.params.id).populate("user_id", "profile").populate("question_id", "title");
  if (!answer) return res.status(404).send("Answer not found");
  res.send(answer);
});

router.post("/", [auth, validateAnswer, checkUserBody], async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.user_id)) return res.status(400).send("Invalid User ID");
    if (!mongoose.Types.ObjectId.isValid(req.body.question_id)) return res.status(400).send("Invalid Question ID");
    
    const answer = new Answer({
      user_id: req.body.user_id,
      question_id: req.body.question_id,
      body: req.body.body,
      timestamp: req.body.timestamp,
      upvotes: req.body.upvotes,
      downvotes: req.body.downvotes,
    });

    await answer.save();

    res.status(201).send({
      message: "Answer created successfully",
      answer: answer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

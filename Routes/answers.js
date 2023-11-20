const express = require("express");
const { Answer } = require("../Models/answersModel");
const validate = require("../Middleware/validateAnswer");
const { Question } = require("../Models/questionsModel");
const { User } = require("../Models/usersModel");
const { default: mongoose } = require("mongoose");
const auth = require("../Middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const answers = await Answer.find();
  if (!answers) return res.status(404).send("Answers not found");
  if (answers.length < 1) return res.status(404).send("Answers not found");
  res.send(answers);
});
router.get("/:id", async (req, res) => {
  const answer = await Answer.findById(req.params.id);
  if (!answer) return res.status(404).send("Answer not found");
  res.send(answer);
});

router.post("/", auth, async (req, res) => {
  const validatedAnswer = validate(req.body);
  if (validatedAnswer.error)
    return res.status(400).send(validatedAnswer.error.details[0].message);

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
      answer: {
        user_id: answer.user_id,
        question_id: answer.question_id,
        body: answer.body,
        timestamp: answer.timestamp,
        upvotes: answer.upvotes,
        downvotes: answer.downvotes,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;

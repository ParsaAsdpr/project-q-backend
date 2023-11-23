const express = require("express");
const { Question } = require("../Models/questionsModel");
const validate = require("../validations/validateQuestion");
const { default: mongoose } = require("mongoose");
const auth = require("../Middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const questions = await Question.find();
  if (!questions) return res.status(404).send("No questions found");
  if (questions.length < 1) return res.status(404).send("No questions found");
  res.send(questions);
});
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).send("Question not found");
    res.send(question);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", auth, async (req, res) => {
  const validatedQuestion = validate(req.body);

  if (validatedQuestion.error)
    return res.status(400).send(validatedQuestion.error.details[0].message);

  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.user_id)) {
      return res.status(400).send("Invalid User ID");
    }
    const question = new Question({
      user_id: req.body.user_id,
      title: req.body.title,
      body: req.body.body,
      timestamp: req.body.timestamp,
      tags: req.body.tags,
    });

    await question.save();

    res.status(201).send({
      message: "User created successfully",
      question: {
        user_id: question.user_id,
        title: question.title,
        body: question.body,
        timestamp: question.timestamp,
        tags: question.tags,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the user.");
    return;
  }
});

module.exports = router;

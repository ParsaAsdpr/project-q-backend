const express = require("express");
const { Question } = require("../Models/questionsModel");
const validate = require("../utils/Middleware/validations/validateQuestion");
const { default: mongoose } = require("mongoose");
const auth = require("../utils/Middleware/auth");
const checkUserBody = require("../utils/Middleware/checkUserBody");

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

router.post("/", [auth], async (req, res) => {
  const validatedQuestion = validate(req.body);

  if (validatedQuestion.error)
    return res.status(400).send(validatedQuestion.error.details[0].message);

  try {
    const question = new Question({
      title: req.body.title,
      timestamp: req.body.timestamp,
      tags: req.body.tags,
    });

    await question.save();

    res.status(201).send({
      message: "Question created successfully",
      question: question,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the user.");
    return;
  }
});

module.exports = router;

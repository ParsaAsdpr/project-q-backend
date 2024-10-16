import { Request, Response } from "express";

const express = require("express");
const { Question } = require("../Models/questionsModel");
const validate = require("../utils/Middleware/validations/validateQuestion");
const { default: mongoose } = require("mongoose");
const auth = require("../utils/Middleware/auth");
const checkUserBody = require("../utils/Middleware/checkUserBody");

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const questions = await Question.find();
  if (!questions) return res.status(404).send("سوالی پیدا نشد");
  if (questions.length < 1) return res.status(404).send("سوالی پیدا نشد");
  res.send(questions);
});
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const question = await Question.findById(req.params.id).populate({
      path: "answers",
      populate: {
        path: "user",
      },
    });

    if (!question) return res.status(404).send("سوال مورد نظر پیدا نشد");
    res.send(question);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      return res.status(400).send("شناسه سوال نامعتبر است");
    }
    console.error(error);
    res.status(500).send("مشکلی پیش آمده است");
  }
});

router.post("/", [auth], async (req: Request, res: Response) => {
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
      message: "سوال شما با موفقیت ثبت شد",
      question: question,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("مشکلی پیش آمده است");
    return;
  }
});

module.exports = router;

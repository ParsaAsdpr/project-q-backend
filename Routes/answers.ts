import { Request, Response } from "express";

const express = require("express");
const { Answers } = require("../Models/answersModel");
const { default: mongoose } = require("mongoose");
const auth = require("../utils/Middleware/auth");
const checkUserBody = require("../utils/Middleware/checkUserBody");
const {validateAnswer} = require("../utils/Middleware/validations/validateAnswer");
const { Question } = require("../Models/questionsModel");

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const answers = await Answers.find().populate("user", "username + profile").populate("question", "title");
  if (!answers) return res.status(404).send("جوابی پیدا نشد");
  if (answers.length < 1) return res.status(404).send("جوابی پیدا نشد");
  res.send(answers);
});
router.get("/:id", async (req: Request, res: Response) => {
  const answer = await Answers.findById(req.params.id).populate("user", "username + profile").populate("question", "title");
  if (!answer) return res.status(404).send("جواب مورد نظر پیدا نشد");
  res.send(answer);
});

router.post("/",[auth], async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.user)) return res.status(400).send("شناسه کاربر نامعتبر است");
    if (!mongoose.Types.ObjectId.isValid(req.body.question)) return res.status(400).send("شناسه سوال نامعتبر است");

    const questionExists = await Question.exists({ _id: req.body.question });
    if (!questionExists) {
      return res.status(400).send("سوال مورد نظر وجود ندارد");
    }

    const answer = new Answers({
      user: req.body.user,
      question: req.body.question,
      body: req.body.body,
      timestamp: req.body.timestamp,
      upvotes: req.body.upvotes,
      downvotes: req.body.downvotes,
    });

    await answer.save();

    await Question.findByIdAndUpdate(
      req.body.question,
      { $push: { answers: answer._id } },
      { new: true }
    );

    res.status(201).send({
      message: "سوال با موفقیت ثبت شد",
      answer: answer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("مشکلی پیش آمده است");
  }
});
module.exports = router;
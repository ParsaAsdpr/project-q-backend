import { Request, Response } from "express";

const express = require("express");
const { User } = require("../../Models/usersModel");
const auth = require("../../utils/Middleware/auth");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/:username", auth, async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).send("کاربری یافت نشد");

  const decoded = jwt.verify(req.header("x-auth-token"), "pvKey");

  if (user._id.toString() === decoded._id.toString())
    return res.status(400).send("شما نمیتوانید خودتان را دنبال کنید");

  if (user.followers.includes(decoded._id))
    return res.status(400).send("شما قبلا دنبال کرده اید");

  user.followers.push(decoded._id);
  await user.save();

  await User.findByIdAndUpdate(
    decoded._id,
    { $push: { following: user._id } },
    { new: true }
  );

  res.send("دنبال کردن با موفقیت انجام شد");
});

module.exports = router;

import { Request, Response } from "express";

const express = require("express");
const { User } = require("../Models/usersModel");
const validate = require("../utils/Middleware/validations/validateLogin");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) return res.status(400).send("نام کاربری یا رمز عبور اشتباه است");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("نام کاربری یا رمز عبور اشتباه است");

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .status(200)
    .send(token);
});

module.exports = router;

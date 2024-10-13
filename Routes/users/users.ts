import { Request, Response } from "express";

const express = require("express");
const {
  validateUser,
  validateEditUser,
} = require("../../utils/Middleware/validations/validateUser");
const { User } = require("../../Models/usersModel");
const bcrypt = require("bcrypt");
const auth = require("../../utils/Middleware/auth");
const isAdmin = require("../../utils/Middleware/isAdmin");
const _ = require("lodash");
const checkUserParams = require("../../utils/Middleware/checkUserParams");

const router = express.Router();

router.get("/", [auth, isAdmin], async (req: Request, res: Response) => {
  const users = await User.find();
  if (!users) return res.status(404).send("کاربری یافت نشد");
  if (users.length < 1) return res.status(404).send("کاربری یافت نشد");
  res.send(users);
});
router.get("/:username", async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).send("کاربری با این نام کاربری یافت نشد");
  res.send(_.pick(user, ["_id", "username", "profile"]));
});

router.post("/", async (req: Request, res: Response) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    $or: [{ email: req.body.email?.toLowerCase() }, { username: req.body.username?.toLowerCase() }],
  });
  if (user) return res.status(400).send("این ایمیل یا نام کاربری قبلا ثبت شده است");

  user = new User({
    email: req.body.email?.toLowerCase(),
    username: req.body.username?.toLowerCase(),
    profile: req.body.profile,
    password: req.body.password
  });
  
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "profile", "username", "email"]));
});

router.put("/:id", [auth, checkUserParams], async (req: Request, res: Response) => {
  try {
    const { error } = validateEditUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("کاربری با این شناسه یافت نشد");

    user.email = req.body.email?.toLowerCase() || user.email.toLowerCase();
    user.username =
      req.body.username?.toLowerCase() || user.username.toLowerCase();
    user.profile =
      {
        name: req.body.profile.name || user.profile.name,
        bio: req.body.profile.bio || user.profile.bio,
        profile_picture:
          req.body.profile.profile_picture || user.profile.profile_picture,
        job: req.body.profile.job || user.profile.job,
        website: req.body.profile.website || user.profile.website,
        social_links:
          req.body.profile.social_links || user.profile.social_links,
      };
    user.password = req.body.password || user.password;

    if (req.body.password && req.body.password !== user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    await user.save();

    const token = user.generateAuthToken();

    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["_id", "profile", "username", "email"]));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

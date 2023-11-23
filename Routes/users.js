const express = require("express");
const validate = require("../validations/validateUser");
const { User } = require("../Models/usersModel");
const bcrypt = require("bcrypt");
const auth = require("../Middleware/auth");
const isAdmin = require("../Middleware/isAdmin");
const _ = require('lodash');
const checkUser = require("../Middleware/checkUser");

const router = express.Router();

router.get("/", [auth, isAdmin], async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(404).send("No users found");
  if (users.length < 1) return res.status(404).send("No users found");
  res.send(users);
});
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("No user found");
  res.send(_.pick(user, ['_id', 'username', 'profile' ]));
});


router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(
    _.pick(req.body, ["email", "username", "profile", "password"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "profile", "username", "email"]));
});


router.put('/:id', [auth, checkUser], async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    user.email = req.body.email;
    user.username = req.body.username;
    user.profile = req.body.profile;
    user.password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .send(_.pick(user, ['_id', 'profile', 'username', 'email']));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

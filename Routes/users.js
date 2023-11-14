const express = require("express");
const validate = require("../Middleware/validateUser");
const { User } = require("../Models/usersModel");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(404).send("No users found");
  if (users.length < 1) return res.status(404).send("No users found");
  res.send(users);
});
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("No user found");
  res.send(user);
})

router.post("/", async (req, res) => {
  const validatedUser = validate(req.body);
  if (validatedUser.error) res.status(400).send(validatedUser.error.details[0].message);

  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    profile: req.body.profile,
    accountCreated: req.body.accountCreated || new Date(),
  });
  
  try {
    await user.save();
    
    res.status(201).send({
      message: "User created successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        accountCreated: user.accountCreated,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the user.");
    return;
  }
});

module.exports = router;

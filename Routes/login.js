const express = require("express");
const { User } = require("../Models/usersModel");
const validate = require("../Middleware/validateLogin");
const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt')

const router = express.Router();

router.post("/", async (req, res) => {
    const {error} = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');
  
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    res.send(true);
  });
  
module.exports = router;

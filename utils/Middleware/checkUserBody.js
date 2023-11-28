const { User } = require("../../Models/usersModel");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, "pvKey");
    const userId = decoded._id;

    const user = await User.findById(userId);
    if (!user) {
      console.log(userId, user);
      return res.status(404).send("User not found");
    }

    if (user._id.toString() !== req.body.user_id) {
      return res.status(403).send("Access denied");
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

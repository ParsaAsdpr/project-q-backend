const express = require("express");
const auth = require("../utils/Middleware/auth");
const checkUser = require("../utils/Middleware/checkUser");
const { User } = require("../Models/usersModel");
const { uploadInStorage } = require("../utils/storage");
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.post(
  "/:id",
  [auth, checkUser, uploadInStorage.single("avatar")],
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).send("User not found");

      if (user.profile.profile_picture && user.profile.profile_picture !== "/static/images/default.png") {
        const currentAvatarPath = path.join(__dirname, '..' , user.profile.profile_picture.substr(1));
        try {
          fs.unlinkSync(path.normalize(currentAvatarPath));
          console.log("Deleted the current avatar:", path.normalize(currentAvatarPath));
        } catch (deleteError) {
          console.error("Error deleting the current avatar:", deleteError);
        }
      }

      user.email = user.email.toLowerCase();
      user.username = user.username.toLowerCase();
      user.profile =
        {
          name: user.profile.name,
          bio: user.profile.bio,
          profile_picture: '/' + req.file.path || "/static/images/default.png",
          job: user.profile.job,
          website: user.profile.website,
          social_links: user.profile.social_links,
        } || user.profile;
      user.password = user.password;

      await user.save();

      const token = user.generateAuthToken();

      res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(user.profile.profile_picture);

      console.log();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },
  password: { type: String, required: true },
  profile: {
    name: { type: String, default: null },
    bio: { type: String, default: null },
    profile_picture: { type: String, default: "/static/images/default.png" },
    location: { type: String, default: null },
    website: { type: String, default: null },
    social_links: [
      {
        platform: { type: String },
        url: { type: String },
        default: [],
      },
    ],
  },
  accountCreated: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, "pvKey");
  return token;
};

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;

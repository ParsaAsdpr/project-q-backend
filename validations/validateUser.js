const Joi = require("joi");

const validateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(40).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
    profile: Joi.object({
      name: Joi.string().min(3).max(80).required(),
      bio: Joi.string().min(5).max(300),
      profile_picture: Joi.string().uri(),
      location: Joi.string(),
      website: Joi.string().uri(),
      social_links: Joi.array().items(
        Joi.object({ platform: Joi.string(), url: Joi.string().uri() })
      ),
    }).required(),
    accountCreated: Joi.date(),
  });
  return schema.validate(user);
};

module.exports = validateUser;

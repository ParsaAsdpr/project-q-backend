const Joi = require("joi");

const validateQuestion = (question) => {
  const schema = Joi.object({
    title: Joi.string().min(10).max(300).required(),
    timestamp: Joi.date(),
    tags: Joi.array().items(Joi.string()).required(),
    follower: Joi.number(),
  });

  return schema.validate(question);
};

module.exports = validateQuestion;
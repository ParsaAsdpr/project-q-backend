const Joi = require("joi");

const validateQuestion = (question) => {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    title: Joi.string().min(10).max(300).required(),
    body: Joi.string().min(50).required(),
    timestamp: Joi.date(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  return schema.validate(question);
};

module.exports = validateQuestion;
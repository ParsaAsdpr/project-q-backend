const Joi = require('joi');

const validateAnswer = (answer) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        question_id: Joi.string().required(),
        body: Joi.string().min(50).required(),
        timestamp: Joi.date(),
        upvotes: Joi.number(),
        downvotes: Joi.number(),
        shareCount: Joi.number()
    });

    return schema.validate(answer);
}

module.exports = validateAnswer
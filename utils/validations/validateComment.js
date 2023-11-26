const Joi = require('joi');

const validateComment = (comment) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        answer_id: Joi.string().required(),
        body: Joi.string().min(10).required(),
        timestamp: Joi.date(),
    });
    return schema.validate(comment);
}

module.exports = validateComment
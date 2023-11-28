const Joi = require('joi');

const validateAnswer = (req, res, next) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        question: Joi.string().required(),
        body: Joi.string().min(50).required(),
        timestamp: Joi.date(),
        upvotes: Joi.number(),
        downvotes: Joi.number(),
        shareCount: Joi.number(),
        views: Joi.number(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
}

module.exports = {validateAnswer};
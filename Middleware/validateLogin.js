const Joi = require('joi');

const validateLogin = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().min(7).required(),
        password: Joi.string().min(8).max(30).required(),
    });
    return schema.validate(user);
}

module.exports = validateLogin
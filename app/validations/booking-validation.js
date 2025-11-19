const Joi = require('joi');

const bookingValidationSchema = Joi.object({
    pgId: Joi.string().required().messages({
        'any.required': 'Pg Id is required'
    }),
    roomType: Joi.string().required().messages({
        'any.required': 'Room type is required'
    }),
    duration: Joi.number().min(1).required().messages({
        'any.required': 'Duration is required'
    }),
    amount: Joi.number().min(0).required().messages({
        'any.required': 'Amount is required'
    })
});

module.exports = bookingValidationSchema;
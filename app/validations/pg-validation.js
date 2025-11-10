const Joi = require('joi');

const pgValidationSchema = Joi.object({
    pgname: Joi.string().trim().min(3).max(100).required().messages({
        'any.required': 'pg name is required'
    }),
    location: Joi.object({
        address: Joi.string().required().messages({
            'any.required': 'address is required'
        }),
        coordinates: Joi.object({
            latitude: Joi.number().required().messages({
                'any.required': 'latitude is required'
            }),
            longitude: Joi.number().required(). messages({
                'any.required': 'longitude is required'
            })
        }).required()
    }).required(),
    roomTypes: Joi.array().items(
        Joi.object({
            roomType: Joi.string().required().messages({
                'any.required': 'room type is required'
            }),
            name: Joi.string().required().messages({
                'any.required': 'room name is required'
            }),
            rent: Joi.number().min(0).required().messages({
                'any.required': 'room rent is required'
            })
        })
    ).min(1).required().messages({
        'array.min': 'atleast one room type is required'
    }),
    description: Joi.string().allow('').optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    photos: Joi.array().items(Joi.string()).optional()
});

module.exports = { pgValidationSchema };
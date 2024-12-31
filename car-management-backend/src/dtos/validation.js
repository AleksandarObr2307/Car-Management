const Joi = require('joi');

const carValidation = {
    create: Joi.object({
        make: Joi.string().required(),
        model: Joi.string().required(),
        productionYear: Joi.number().integer().required(),
        licensePlate: Joi.string().required(),
        garageIds: Joi.array().items(Joi.number()).required()
    }),
    update: Joi.object({
        make: Joi.string(),
        model: Joi.string(),
        productionYear: Joi.number().integer(),
        licensePlate: Joi.string(),
        garageIds: Joi.array().items(Joi.number())
    })
};

const garageValidation = {
    create: Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        city: Joi.string().required(),
        capacity: Joi.number().integer().required()
    }),
    update: Joi.object({
        name: Joi.string(),
        location: Joi.string(),
        city: Joi.string(),
        capacity: Joi.number().integer()
    })
};

const maintenanceValidation = {
    create: Joi.object({
        carId: Joi.number().integer().required(),
        garageId: Joi.number().integer().required(),
        serviceType: Joi.string().required(),
        scheduledDate: Joi.date().required()
    }),
    update: Joi.object({
        carId: Joi.number().integer(),
        garageId: Joi.number().integer(),
        serviceType: Joi.string(),
        scheduledDate: Joi.date()
    })
};

module.exports = {
    carValidation,
    garageValidation,
    maintenanceValidation
};
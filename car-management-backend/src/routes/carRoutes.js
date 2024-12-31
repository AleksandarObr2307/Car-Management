const express = require('express');
const router = express.Router();
const carService = require('../services/carService');
const validateRequest = require('../middleware/validateRequest');
const { carValidation } = require('../dtos/validation');

// Get all cars with filters
router.get('/', async (req, res) => {
    try {
        const filters = {
            carMake: req.query.carMake,
            garageId: req.query.garageId ? parseInt(req.query.garageId) : null,
            fromYear: req.query.fromYear ? parseInt(req.query.fromYear) : null,
            toYear: req.query.toYear ? parseInt(req.query.toYear) : null
        };
        const cars = await carService.getCars(filters);
        res.json(cars);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get single car
router.get('/:id', async (req, res) => {
    try {
        const car = await carService.getCar(parseInt(req.params.id));
        res.json(car);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Create car
router.post('/', validateRequest(carValidation.create), async (req, res) => {
    try {
        const car = await carService.createCar(req.body);
        res.status(201).json(car);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update car
router.put('/:id', validateRequest(carValidation.update), async (req, res) => {
    try {
        const car = await carService.updateCar(parseInt(req.params.id), req.body);
        res.json(car);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete car
router.delete('/:id', async (req, res) => {
    try {
        await carService.deleteCar(parseInt(req.params.id));
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
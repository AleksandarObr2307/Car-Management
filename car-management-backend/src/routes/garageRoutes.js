const express = require('express');
const router = express.Router();
const garageService = require('../services/garageService');
const validateRequest = require('../middleware/validateRequest');
const { garageValidation } = require('../dtos/validation');

// Get daily availability report
router.get('/dailyAvailabilityReport', async (req, res) => {
    try {
        const { garageId, startDate, endDate } = req.query;
        const report = await garageService.getDailyAvailabilityReport(
            parseInt(garageId),
            new Date(startDate),
            new Date(endDate)
        );
        res.json(report);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all garages
router.get('/', async (req, res) => {
    try {
        const garages = await garageService.getGarages(req.query.city);
        res.json(garages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get single garage
router.get('/:id', async (req, res) => {
    try {
        const garage = await garageService.getGarage(parseInt(req.params.id));
        res.json(garage);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Create garage
router.post('/', validateRequest(garageValidation.create), async (req, res) => {
    try {
        const garage = await garageService.createGarage(req.body);
        res.status(201).json(garage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update garage
router.put('/:id', validateRequest(garageValidation.update), async (req, res) => {
    try {
        const garage = await garageService.updateGarage(parseInt(req.params.id), req.body);
        res.json(garage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete garage
router.delete('/:id', async (req, res) => {
    try {
        await garageService.deleteGarage(parseInt(req.params.id));
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
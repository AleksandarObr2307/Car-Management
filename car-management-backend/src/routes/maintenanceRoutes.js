const express = require('express');
const router = express.Router();
const maintenanceService = require('../services/maintenanceService');
const validateRequest = require('../middleware/validateRequest');
const { maintenanceValidation } = require('../dtos/validation');

// Get all maintenances with filters
router.get('/', async (req, res) => {
    try {
        const filters = {
            carId: req.query.carId ? parseInt(req.query.carId) : null,
            garageId: req.query.garageId ? parseInt(req.query.garageId) : null,
            startDate: req.query.startDate ? new Date(req.query.startDate) : null,
            endDate: req.query.endDate ? new Date(req.query.endDate) : null
        };
        const maintenances = await maintenanceService.getMaintenances(filters);
        res.json(maintenances);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get single maintenance
router.get('/:id', async (req, res) => {
    try {
        const maintenance = await maintenanceService.getMaintenance(parseInt(req.params.id));
        res.json(maintenance);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Create maintenance
router.post('/', validateRequest(maintenanceValidation.create), async (req, res) => {
    try {
        const maintenance = await maintenanceService.createMaintenance(req.body);
        res.status(201).json(maintenance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update maintenance
router.put('/:id', validateRequest(maintenanceValidation.update), async (req, res) => {
    try {
        const maintenance = await maintenanceService.updateMaintenance(
            parseInt(req.params.id),
            req.body
        );
        res.json(maintenance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete maintenance
router.delete('/:id', async (req, res) => {
    try {
        await maintenanceService.deleteMaintenance(parseInt(req.params.id));
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
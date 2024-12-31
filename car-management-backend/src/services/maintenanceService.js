const { Maintenance, Car, Garage } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

class MaintenanceService {
    async getMaintenance(id) {
        const maintenance = await Maintenance.findByPk(id, {
            include: [
                { model: Car },
                { model: Garage }
            ]
        });
        if (!maintenance) throw new Error('Maintenance not found');
        return maintenance;
    }

    async getMaintenances(filters) {
        const where = {};
        
        if (filters.carId) where.car_id = filters.carId;
        if (filters.garageId) where.garage_id = filters.garageId;
        if (filters.startDate) where.scheduledDate = { 
            ...where.scheduledDate,
            [Op.gte]: filters.startDate 
        };
        if (filters.endDate) where.scheduledDate = { 
            ...where.scheduledDate,
            [Op.lte]: filters.endDate 
        };

        return await Maintenance.findAll({
            where,
            include: [
                { model: Car },
                { model: Garage }
            ]
        });
    }

    async createMaintenance(maintenanceData) {
        const garage = await Garage.findByPk(maintenanceData.garageId);
        if (!garage) throw new Error('Garage not found');

        const existingMaintenances = await this.getMaintenanceCountForDate(
            maintenanceData.garageId,
            maintenanceData.scheduledDate
        );

        if (existingMaintenances >= garage.capacity) {
            throw new Error('Garage is full for this date');
        }

        return await Maintenance.create({
            car_id: maintenanceData.carId,
            garage_id: maintenanceData.garageId,
            serviceType: maintenanceData.serviceType,
            scheduledDate: maintenanceData.scheduledDate
        });
    }

    async updateMaintenance(id, maintenanceData) {
        const maintenance = await this.getMaintenance(id);
        
        if (maintenanceData.garageId && maintenanceData.scheduledDate) {
            const garage = await Garage.findByPk(maintenanceData.garageId);
            const existingMaintenances = await this.getMaintenanceCountForDate(
                maintenanceData.garageId,
                maintenanceData.scheduledDate
            );

            if (existingMaintenances >= garage.capacity) {
                throw new Error('Garage is full for this date');
            }
        }

        return await maintenance.update({
            car_id: maintenanceData.carId,
            garage_id: maintenanceData.garageId,
            serviceType: maintenanceData.serviceType,
            scheduledDate: maintenanceData.scheduledDate
        });
    }

    async deleteMaintenance(id) {
        const maintenance = await this.getMaintenance(id);
        await maintenance.destroy();
        return true;
    }

    async getMaintenanceCountForDate(garageId, date) {
        const startOfDay = moment(date).startOf('day').toDate();
        const endOfDay = moment(date).endOf('day').toDate();

        return await Maintenance.count({
            where: {
                garage_id: garageId,
                scheduledDate: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });
    }
}

module.exports = new MaintenanceService();
const { Garage, Maintenance } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

class GarageService {
    async getGarage(id) {
        const garage = await Garage.findByPk(id);
        if (!garage) throw new Error('Garage not found');
        return garage;
    }

    async getGarages(city) {
        const where = {};
        if (city) {
            where.city = { [Op.like]: `%${city}%` };
        }
        return await Garage.findAll({ where });
    }

    async createGarage(garageData) {
        return await Garage.create(garageData);
    }

    async updateGarage(id, garageData) {
        const garage = await this.getGarage(id);
        return await garage.update(garageData);
    }

    async deleteGarage(id) {
        const garage = await this.getGarage(id);
        await garage.destroy();
        return true;
    }

    async getDailyAvailabilityReport(garageId, startDate, endDate) {
        const garage = await this.getGarage(garageId);
        const maintenances = await Maintenance.findAll({
            where: {
                garage_id: garageId,
                scheduledDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                [fn('date', col('scheduledDate')), 'date'],
                [fn('count', '*'), 'requests']
            ],
            group: [fn('date', col('scheduledDate'))],
            raw: true
        });

        return maintenances.map(m => ({
            date: m.date,
            requests: parseInt(m.requests),
            availableCapacity: garage.capacity - parseInt(m.requests)
        }));
    }
}

module.exports = new GarageService();
const { Car, Garage } = require('../models');
const { Op } = require('sequelize');

class CarService {
    async getCar(id) {
        const car = await Car.findByPk(id, {
            include: [{ 
                model: Garage,
                as: 'garages' // This is important
            }]
        });
        if (!car) throw new Error('Car not found');
        return car;
    }

    async getCars(filters) {
        const where = {};
        
        if (filters.carMake) {
            where.make = { [Op.like]: `%${filters.carMake.toUpperCase()}%` };
        }
        if (filters.fromYear) {
            where.productionYear = { ...where.productionYear, [Op.gte]: filters.fromYear };
        }
        if (filters.toYear) {
            where.productionYear = { ...where.productionYear, [Op.lte]: filters.toYear };
        }

        const query = {
            where,
            include: [{ 
                model: Garage,
                as: 'garages' // This is important
            }]
        };

        if (filters.garageId) {
            query.include[0].where = { id: filters.garageId };
        }

        return await Car.findAll(query);
    }

    async createCar(carData) {
        const existingCar = await Car.findOne({
            where: { licensePlate: carData.licensePlate }
        });

        if (existingCar) {
            throw new Error('Car with this license plate already exists');
        }

        const car = await Car.create(carData);
        
        if (carData.garageIds && carData.garageIds.length > 0) {
            const garages = await Garage.findAll({
                where: { id: carData.garageIds }
            });
            await car.setGarages(garages);
        }

        return this.getCar(car.id);
    }

    async updateCar(id, carData) {
        const car = await this.getCar(id);
        await car.update(carData);

        if (carData.garageIds !== undefined) {
            const garages = carData.garageIds.length > 0 
                ? await Garage.findAll({ where: { id: carData.garageIds } })
                : [];
            await car.setGarages(garages);
        }

        return this.getCar(id);
    }

    async deleteCar(id) {
        const car = await this.getCar(id);
        await car.destroy();
        return true;
    }
}

module.exports = new CarService();
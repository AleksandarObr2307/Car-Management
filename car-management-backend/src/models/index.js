const Car = require('./Car');
const Garage = require('./Garage');
const Maintenance = require('./Maintenance');

// Define relationships with explicit naming
Car.belongsToMany(Garage, { 
    through: 'CarGarage',
    as: 'garages', // This will force lowercase
    foreignKey: 'car_id',
    otherKey: 'garage_id',
    onDelete: 'CASCADE'
});

Garage.belongsToMany(Car, { 
    through: 'CarGarage',
    as: 'cars', // This will force lowercase
    foreignKey: 'garage_id',
    otherKey: 'car_id',
    onDelete: 'CASCADE'
});

// Update other relationships similarly
Car.hasMany(Maintenance, { 
    as: 'maintenances',
    foreignKey: 'car_id',
    onDelete: 'CASCADE'
});
Maintenance.belongsTo(Car, { 
    as: 'car',
    foreignKey: 'car_id'
});

Garage.hasMany(Maintenance, { 
    as: 'maintenances',
    foreignKey: 'garage_id',
    onDelete: 'CASCADE'
});
Maintenance.belongsTo(Garage, { 
    as: 'garage',
    foreignKey: 'garage_id'
});

module.exports = {
    Car,
    Garage,
    Maintenance
};
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Car = sequelize.define('Car', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    make: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productionYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    licensePlate: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
});

module.exports = Car;
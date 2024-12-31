const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Maintenance = sequelize.define('Maintenance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    serviceType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    scheduledDate: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = Maintenance;
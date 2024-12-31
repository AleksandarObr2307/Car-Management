const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const carRoutes = require('./routes/carRoutes');
const garageRoutes = require('./routes/garageRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://192.168.100.3:3000', 'http://localhost:3000', 'http://localhost:8088', 'http://localhost:5500', 'http://localhost:8080'],
    credentials: true
}));

// Routes
app.use('/cars', carRoutes);
app.use('/garages', garageRoutes);
app.use('/maintenance', maintenanceRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: `Hello API user with host -> ${req.ip}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Database sync and server start
const PORT = process.env.PORT || 8088;

async function startServer() {
    try {
        await sequelize.sync();
        console.log('Database synchronized successfully');
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
}

startServer();

module.exports = app;
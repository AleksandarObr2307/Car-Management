API documentation Car Management System:

```markdown
# Car Management System API Documentation

## Base URL
```
http://localhost:8088
```

## Authentication (Future Implementation)
```javascript
// Add JWT Authentication
const jwt = require('jsonwebtoken');

// Middleware example
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Apply to routes
router.use(authenticateToken);
```

## Error Responses
```json
{
    "message": "Error message description"
}
```

## Cars API

### Get All Cars
```
GET /cars
```

Query Parameters:
- `carMake` (string, optional): Filter by car make
- `garageId` (number, optional): Filter by garage
- `fromYear` (number, optional): Filter by minimum year
- `toYear` (number, optional): Filter by maximum year

Response:
```json
[
    {
        "id": 1,
        "make": "BMW",
        "model": "X5",
        "productionYear": 2020,
        "licensePlate": "AB1234CD",
        "garages": [
            {
                "id": 1,
                "name": "Central Garage",
                "location": "Downtown",
                "city": "Sofia",
                "capacity": 20
            }
        ],
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
    }
]
```

### Get Single Car
```
GET /cars/:id
```

Response:
```json
{
    "id": 1,
    "make": "BMW",
    "model": "X5",
    "productionYear": 2020,
    "licensePlate": "AB1234CD",
    "garages": []
}
```

### Create Car
```
POST /cars
```

Request Body:
```json
{
    "make": "BMW",
    "model": "X5",
    "productionYear": 2020,
    "licensePlate": "AB1234CD",
    "garageIds": [1, 2]
}
```

### Update Car
```
PUT /cars/:id
```

Request Body:
```json
{
    "make": "BMW",
    "model": "X5",
    "productionYear": 2020,
    "licensePlate": "AB1234CD",
    "garageIds": [1, 2]
}
```

### Delete Car
```
DELETE /cars/:id
```

## Garages API

### Get All Garages
```
GET /garages
```

Query Parameters:
- `city` (string, optional): Filter by city

### Get Single Garage
```
GET /garages/:id
```

### Create Garage
```
POST /garages
```

Request Body:
```json
{
    "name": "Central Garage",
    "location": "Downtown",
    "city": "Sofia",
    "capacity": 20
}
```

### Update Garage
```
PUT /garages/:id
```

Request Body:
```json
{
    "name": "Central Garage",
    "location": "Downtown",
    "city": "Sofia",
    "capacity": 20
}
```

### Delete Garage
```
DELETE /garages/:id
```

### Get Daily Availability Report
```
GET /garages/dailyAvailabilityReport
```

Query Parameters:
- `garageId` (number): Garage ID
- `startDate` (string): Start date (YYYY-MM-DD)
- `endDate` (string): End date (YYYY-MM-DD)

## Maintenance API

### Get All Maintenances
```
GET /maintenance
```

Query Parameters:
- `carId` (number, optional): Filter by car
- `garageId` (number, optional): Filter by garage
- `startDate` (string, optional): Filter by start date
- `endDate` (string, optional): Filter by end date

### Get Single Maintenance
```
GET /maintenance/:id
```

### Create Maintenance
```
POST /maintenance
```

Request Body:
```json
{
    "carId": 1,
    "garageId": 1,
    "serviceType": "Oil Change",
    "scheduledDate": "2024-01-01T10:00:00.000Z"
}
```

### Update Maintenance
```
PUT /maintenance/:id
```

Request Body:
```json
{
    "carId": 1,
    "garageId": 1,
    "serviceType": "Oil Change",
    "scheduledDate": "2024-01-01T10:00:00.000Z"
}
```

### Delete Maintenance
```
DELETE /maintenance/:id
```

## Security Implementation

### 1. Environment Variables
```javascript
// .env
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=8088
```

### 2. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

### 3. Helmet Security Headers
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 4. CORS Configuration
```javascript
const cors = require('cors');

const corsOptions = {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
```

### 5. Request Validation
```javascript
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            });
        }
        next();
    };
};
```

### 6. SQL Injection Protection
Sequelize ORM provides built-in SQL injection protection, but always use:
```javascript
// Use parameterized queries
const car = await Car.findOne({
    where: {
        id: req.params.id // Safe
    }
});
```

### 7. Error Handling
```javascript
// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});
```

### 8. Input Sanitization
```javascript
const sanitize = require('sanitize-html');

// Middleware
const sanitizeInput = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitize(req.body[key]);
            }
        });
    }
    next();
};

app.use(sanitizeInput);
```

## Required Dependencies
```json
{
  "dependencies": {
    "express": "^4.17.1",
    "sequelize": "^6.6.5",
    "sqlite3": "^5.0.2",
    "cors": "^2.8.5",
    "joi": "^17.4.2",
    "jsonwebtoken": "^8.5.1",
    "helmet": "^4.6.0",
    "express-rate-limit": "^5.3.0",
    "sanitize-html": "^2.5.1",
    "dotenv": "^10.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.12"
  }
}
```
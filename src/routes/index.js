const express = require('express');
const router = express.Router();

const buildingRoutes = require('./buildingRoutes')
const spaceRoutes = require('./spaceRoutes')
const sensorDataRoutes = require('./sensorDataRoutes')
const deviceRoutes = require('./deviceRoutes')

/*
const notificationRoutes = require('./notificationRoutes')
const userRoutes = require('./userRoutes')
const loginRoute = require('./loginRoute')
*/

router.use('/sensorData', sensorDataRoutes);
router.use('/buildings', buildingRoutes);
router.use('/buildings', spaceRoutes);
router.use('/devices', deviceRoutes);

/*
router.use('/notifications', notificationRoutes);
router.use('/users', userRoutes);
router.use('/login', loginRoute);
*/

module.exports = router;

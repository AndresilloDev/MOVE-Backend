const express = require('express');
const router = express.Router();

const buildingRoutes = require('./buildingRoutes')
/*
const spaceRoutes = require('./spaceRoutes')
const deviceRoutes = require('./deviceRoutes')
const notificationRoutes = require('./notificationRoutes')
const userRoutes = require('./userRoutes')
const sensorDataRoutes = require('./sensorDataRoutes')
const loginRoute = require('./loginRoute')
*/

router.use('/buildings', buildingRoutes);
/*
router.use('/spaces', spaceRoutes);
router.use('/devices', deviceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/users', userRoutes);
router.use('/sensorData', sensorDataRoutes);
router.use('/login', loginRoute);
*/

module.exports = router;

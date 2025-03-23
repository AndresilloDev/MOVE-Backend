const express = require('express');
const router = express.Router();

const buildingRoutes = require('./buildingRoutes');
const spaceRoutes = require('./spaceRoutes');
const sensorDataRoutes = require('./sensorDataRoutes');
const deviceRoutes = require('./deviceRoutes');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const notificationRoutes = require('./notificationRoutes'); 

/*
const loginRoute = require('./loginRoute')
*/

router.use('/sensorData', sensorDataRoutes);
router.use('/buildings', buildingRoutes);
router.use('/spaces', spaceRoutes);
router.use('/devices', deviceRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/notifications', notificationRoutes); 

/*
router.use('/users', userRoutes);
router.use('/login', loginRoute);
*/

module.exports = router;

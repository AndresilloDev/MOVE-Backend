const express = require('express');
const router = express.Router();
const sensorDataController = require('../controllers/sensorDataController');

router.get('/:deviceId/sensor', sensorDataController.getDeviceSensor);
router.get('/range', sensorDataController.getAllSensorDataInRange);

module.exports = router;

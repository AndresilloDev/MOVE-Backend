const express = require('express');
const router = express.Router();
const sensorDataController = require('../controllers/sensorDataController');

router.get('/:deviceId/sensors', sensorDataController.getDeviceSensorsValues);
router.get('/:deviceId/sensors/data', sensorDataController.getAllSensorDataInRange);

module.exports = router;

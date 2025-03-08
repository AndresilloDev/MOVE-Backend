const express = require('express');
const router = express.Router();
const sensorDataController = require('../controllers/sensorDataController');

router.get('/:device/sensors', sensorDataController.getDeviceSensorsValues);
router.get('/:device/sensors/data', sensorDataController.getAllSensorDataInRange);

module.exports = router;

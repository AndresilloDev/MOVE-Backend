const express = require('express');
const router = express.Router();
const sensorDataController = require('../controllers/sensorDataController');

router.get('/:deviceId/sensors', sensorDataController.getDeviceSensorsValues);
router.put('/:deviceId/sensors/:sensorId/updateSensorThresholds', sensorDataController.updateSensorThresholds);
router.get('/:deviceId/sensors/data', sensorDataController.getAllSensorDataInRange);

module.exports = router;
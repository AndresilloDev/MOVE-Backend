const express = require('express');
const router = express.Router();
const devicesController = require('../controllers/devicesController');

router.get('/', devicesController.getDevices);
router.get('/:deviceId', devicesController.getDevice);
router.delete('/:deviceId', devicesController.deleteDevice);

module.exports = router;

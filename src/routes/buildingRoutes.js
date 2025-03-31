const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');

router.get('/', buildingController.getAllBuildings);
router.get('/name/:name', buildingController.getBuildingByName);
router.get('/:id', buildingController.getBuildingById);
router.post('/', buildingController.createBuilding);
router.put('/:id', buildingController.updateBuilding);
router.delete('/:id', buildingController.deleteBuilding);

router.get('/:buildingId/spaces/count', buildingController.getSpaceCountInBuilding);
router.get('/:buildingId/devices/count', buildingController.getDeviceCountInBuilding);

module.exports = router;

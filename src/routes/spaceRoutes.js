const express = require('express');
const router = express.Router();
const spaceController = require('../controllers/spacesController');

router.post('/:buildingId/spaces', spaceController.createSpace);
router.get('/:buildingId/spaces', spaceController.getSpacesByBuildingId);
router.get('/:buildingId/spaces/:spaceId', spaceController.getSpaceById);
router.put('/:buildingId/spaces/:spaceId', spaceController.updateSpace);
router.delete('/:buildingId/spaces/:spaceId', spaceController.deleteSpace);

module.exports = router;
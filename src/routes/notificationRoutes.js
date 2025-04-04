const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/unfiled', notificationController.getUnfiledNotifications);
router.get('/:id', notificationController.getNotification);
router.get('/filed', notificationController.getFiledNotifications);
router.get('/filed/:id', notificationController.getFiledNotification);
router.post('/', notificationController.createNotification);
router.put('/filed/:id', notificationController.filedNotification);

module.exports = router;

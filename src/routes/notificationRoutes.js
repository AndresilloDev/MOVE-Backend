const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const bodyParser = require('body-parser');

router.get('/unfiled', notificationController.getUnfiledNotifications);
router.get('/filed', notificationController.getFiledNotifications);
router.get('/:id', notificationController.getNotification);
router.get('/filed/:id', notificationController.getFiledNotification);
router.post('/', notificationController.createNotification);
router.put('/filed/:id', notificationController.filedNotification);
router.put('/image', notificationController.updateNotificationImage);

module.exports = router;

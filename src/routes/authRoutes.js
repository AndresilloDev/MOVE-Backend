const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.loginAuth);
router.post('/logout', authController.logoutAuth);
router.get('/checkAuth', authController.checkAuth);

module.exports = router;

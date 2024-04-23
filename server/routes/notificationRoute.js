const express = require('express');
const { createNotification, getNotifications, markNotificationAsRead, createNotificationAdmin, getNotificationsAdmin } = require('../controllers/notificationController');
const router = express.Router();


router.post('/create-notification', createNotification);
router.get('/get-notifications', getNotifications);
router.put('/mark-as-read/:notificationId', markNotificationAsRead);
router.post('/create-notification-admin', createNotificationAdmin);
router.get('/get-notifications-admin', getNotificationsAdmin);

module.exports = router;
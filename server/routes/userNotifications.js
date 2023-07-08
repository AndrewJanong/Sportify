const express = require('express');
const UserNotifications = require('../models/userNotificationsModel');
const 
{
    getNotifications, 
    getUserNotifications,
    deleteNotification,
    createNotification
} = require('../controllers/userNotificationsController');

//const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

//router.use(requireAuth);

// GET all notifications
router.get('/', getNotifications);

// GET user notifications
router.get('/:userId', getUserNotifications);

// POST a notification
router.post('/', createNotification)

// DELETE a notification
router.delete('/:id', deleteNotification)

module.exports = router;
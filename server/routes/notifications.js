const express = require('express');
const Notifications = require('../models/notificationsModel');
const 
{
    getNotifications, 
    getUserNotifications,
    deleteNotification,
    createNotification
} = require('../controllers/notificationsController');

//const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

//router.use(requireAuth);

// GET all notifications
router.get('/', getNotifications);

// GET user notifications
router.get('/:username', getUserNotifications);

// POST a notification
router.post('/', createNotification)

// DELETE a notification
router.delete('/:id', deleteNotification)

module.exports = router;
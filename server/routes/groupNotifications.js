const express = require('express');
const GroupNotifications = require('../models/groupNotificationsModel');
const 
{
    getNotifications, 
    getUserNotifications,
    deleteNotification,
    createNotification
} = require('../controllers/groupNotificationsController');

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
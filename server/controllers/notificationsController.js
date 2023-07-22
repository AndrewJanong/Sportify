const Notifications = require('../models/notificationsModel');
const mongoose = require('mongoose');

// Get all notifications
const getNotifications = async (req, res) => {
    const notifications = await Notifications.find({}).populate('target_user');
    res.status(200).json(notifications);
}

// Get user notifications
const getUserNotifications = async (req, res) => {
    const { userId } = req.params;

    const notifications = await Notifications.find({target_user: userId}).populate('target_user');
    res.status(200).json(notifications);
}

// POST a notification
const createNotification = async (req, res) => {
    const {type, target_user, sender, message} = req.body;

    try {
        const notification = await Notifications.create({type, target_user, sender, message});
        res.status(200).json(notification);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Delete a notification
const deleteNotification = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "No such notification"});
    }

    const notification = await Notifications.findOneAndDelete({_id: id});

    if (!notification) {
        return res.status(400).json({error: "No such notification"});
    }

    res.status(200).json(notification);
}

module.exports = {
    getNotifications,
    getUserNotifications,
    deleteNotification,
    createNotification
}
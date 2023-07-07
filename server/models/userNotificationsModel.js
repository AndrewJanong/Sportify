const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserNotificationSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    target_user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('UserNotifications', UserNotificationSchema);
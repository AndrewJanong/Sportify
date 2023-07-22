const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const meetupMessageSchema = new Schema ({
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'MeetupChat',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('MeetupMessages', meetupMessageSchema);
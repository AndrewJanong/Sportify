const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupMessageSchema = new Schema ({
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'GroupChat',
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

module.exports = mongoose.model('GroupMessages', groupMessageSchema);
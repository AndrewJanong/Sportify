const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupChatSchema = new Schema ({
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Groups',
        required: true
    },
    messages: {
        type: [Schema.Types.ObjectId],
        ref: 'GroupMessages'
    }
}, {timestamps: true})

module.exports = mongoose.model('GroupChat', groupChatSchema);
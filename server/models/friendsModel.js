const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const friendsSchema = new Schema ({
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Number,
        enums: [0, 1, 2, 3]
    }
}, {timestamps: true})

module.exports = mongoose.model('Friends', friendsSchema);
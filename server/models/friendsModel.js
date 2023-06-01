const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const friendsSchema = new Schema ({
    requester: {
        type: String
    },
    recipient: {
        type: String
    },
    status: {
        type: Number,
        enums: [0, 1, 2, 3]
    }
}, {timestamps: true})

module.exports = mongoose.model('Friends', friendsSchema);
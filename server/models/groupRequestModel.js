const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupRequestSchema = new Schema({
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Groups',
        required: true,
    },
    target: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model('GroupReqeusts', groupRequestSchema);
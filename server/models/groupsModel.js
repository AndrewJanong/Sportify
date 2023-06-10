const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    sports: {
        type: String,
        required: true
    },
    members: {
        type: [String],
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Groups', groupSchema);
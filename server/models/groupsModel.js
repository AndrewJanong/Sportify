const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    picture: {
        type: String
    },
    sports: {
        type: String,
        required: true
    },
    members: {
        type: [Schema.Types.Mixed],
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Groups', groupSchema);
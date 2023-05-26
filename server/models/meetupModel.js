const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const meetupSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    sports: {
        type: String,
        required: true
    },
    date: {
        type: String,
        require: true
    },
    location: {
        type: String,
        required: true
    },
    members: {
        type: [String],
        required: true
    },
    vacancy: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        require: true
    },
    user_id: {
        type: String,
        require: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Meetups', meetupSchema);

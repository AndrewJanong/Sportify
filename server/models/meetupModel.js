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
        type: [Schema.Types.ObjectId],
        ref: 'User',
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
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expirationDate: {
        type: Date,
        required: true,
        index: {expires: '0s'}
    }
}, {timestamps: true});

module.exports = mongoose.model('Meetups', meetupSchema);

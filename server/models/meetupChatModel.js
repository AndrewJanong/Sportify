const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const meetupChatSchema = new Schema ({
    meetup: {
        type: Schema.Types.ObjectId,
        ref: 'Meetups',
        required: true
    },
    messages: {
        type: [Schema.Types.ObjectId],
        ref: 'MeetupMessages'
    }
}, {timestamps: true})

module.exports = mongoose.model('MeetupChat', meetupChatSchema);
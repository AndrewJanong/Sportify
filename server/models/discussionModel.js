const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const discussionSchema = new Schema({
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
    text: {
        type: String,
        require: true
    },
    likes: {
        type: [String],
        require: true
    },
    picture: {
        type: String,
    },
    creator: {
        type: String,
        require: true
    },
    user_id: {
        type: String,
        require: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Discussions', discussionSchema);
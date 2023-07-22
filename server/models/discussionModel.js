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
        type: [Schema.Types.ObjectId],
        ref: 'User',
        require: true
    },
    picture: {
        type: String,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'Comments'
    }
}, {timestamps: true})

module.exports = mongoose.model('Discussions', discussionSchema);
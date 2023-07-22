const mongoose = require('mongoose');
const { populate } = require('../models/discussionModel');
const Discussions = require('../models/discussionModel');

//getting all Discussions
const getDiscussions = async (req, res) => {
    const discussions = await Discussions.find({}).sort({createdAt: -1})
    .populate('creator')
    .populate('comments')
    .populate({
        path: 'comments',
        populate: {  path: 'replies' }
    })
    .populate({
        path: 'comments',
        populate: { 
            path: 'replies',
            populate: { path: 'creator' }
        }
    })
    .populate({
        path: 'comments',
        populate: { path: 'creator' }
    });
    res.status(200).json(discussions);
}

//getting a single Discussion
const getDiscussion = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such discussion"});
    }

    const discussion = await Discussions.findById(id)
        .populate('creator')
        .populate('comments')
        .populate({
            path: 'comments',
            populate: {  path: 'replies' }
        })
        .populate({
            path: 'comments',
            populate: { 
                path: 'replies',
                populate: { path: 'creator' }
            }
        })
        .populate({
            path: 'comments',
            populate: { path: 'creator' }
        });
    if (!discussion) {
        return res.status(404).json({error: "No such discussion"});
    }

    res.status(200).json(discussion);
}

//post a single Discussion
const postDiscussion = async (req, res) => {
    const {title, sports, date, text, likes, picture, creator, comments} = req.body;

    if (!(title && sports && date && text && creator)) { 
        return res.status(400).json({error: 'Please fill in all fields'});
    }

    try {
        const user_id = req.user._id;
        const discussion = await Discussions.create({title, sports, date, text, likes, picture, creator, comments, user_id});
        res.status(200).json(discussion);
    } catch (error) {
        res.status(400).json({error: error.message});
    }

}

//deleting a Discussion
const deleteDiscussion = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "No such discussion"});
    }

    const discussion = await Discussions.findOneAndDelete({_id: id});

    if (!discussion) {
        return res.status(400).json({error: "No such discussion"});
    }

    res.status(200).json(discussion);
}

//update a Discussion
const updateDiscussion = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "No such discussion"});
    }

    const discussion = await Discussions.findOneAndUpdate({_id: id}, {...req.body});

    if (!discussion) {
        return res.status(400).json({error: "No such discussion"});
    }

    res.status(200).json(discussion);
}

//commenting on a discussion

module.exports = {getDiscussions, getDiscussion, postDiscussion, deleteDiscussion, updateDiscussion};


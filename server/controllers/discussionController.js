const mongoose = require('mongoose');
const Discussions = require('../models/discussionModel');

//getting all Discussions
const getDiscussions = async (req, res) => {
    const discussions = await Discussions.find({}).sort({createdAt: -1});
    res.status(200).json(discussions);
}

//getting a single Discussion
const getDiscussion = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such discussion"});
    }

    const discussion = await Discussions.findById(id);

    if (!discussion) {
        return res.status(404).json({error: "No such discussion"});
    }

    res.status(200).json(discussion);
}

//post a single Discussion
const postDiscussion = async (req, res) => {
    //check for the likes. 
    const {title, sports, date, text, likes, picture} = req.body;

    if (!(title && sports && date && text)) { //likes?
        return res.status(400).json({error: 'Please fill in all fields'});
    }

    try {
        const user_id = req.user._id;
        
        //check for the picture as it is not required
        const discussion = await Discussions.create({title, sports, date, text, likes, picture, user_id});
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

//commenting on a discussion

module.exports = {getDiscussions, getDiscussion, postDiscussion, deleteDiscussion};


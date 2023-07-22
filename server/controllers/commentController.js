const mongoose = require('mongoose');
const Comments = require('../models/commentModel');

//getting all Comments
const getComments = async (req, res) => {
    const comments = await Comments.find({}).sort({createdAt: -1}).populate('creator');
    res.status(200).json(comments);
}

//getting a single comment
const getComment = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such comment"});
    }

    const comment = await Comments.findById(id).populate('creator');

    if (!comment) {
        return res.status(404).json({error: "No such comment"});
    }

    res.status(200).json(comment);
}

//post a single Comment
const postComment = async (req, res) => {
    const {text, replies, creator} = req.body;

    try {
        const comment = await Comments.create({text, replies, creator});
        res.status(200).json(comment);
    } catch(error) {
        res.status(400).json({error: error.message});
    }
}

//deleting a comment
const deleteComment = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "No such comment"});
    }

    const comment = await Comments.findOneAndDelete({_id: id});

    if (!comment) {
        return res.status(400).json({error: "No such comment"});
    }

    res.status(200).json(comment);
}

//update a comment
const updateComment = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "No such comment"});
    }

    const comment = await Comments.findOneAndUpdate({_id: id}, {...req.body});

    if (!comment) {
        return res.status(400).json({error: "No such comment"});
    }

    res.status(200).json(comment);
}

module.exports = {getComments, getComment, postComment, deleteComment, updateComment};
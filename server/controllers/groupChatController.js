const GroupChat = require('../models/groupChatModel');
const GroupMessages = require('../models/groupMessagesModel');
const mongoose = require('mongoose');

//get a group chat
const getGroupChat = async (req, res) => {
    const { groupId } = req.params;
    const chat = await GroupChat.findOne({group: groupId})
                                .populate("group")
                                .populate("messages")
                                .populate({
                                    path: "messages",
                                    populate: {
                                        path: "sender",
                                        model: "User"
                                    }
                                });
    res.status(200).json(chat);
}

//create a group chat
const createGroupChat = async (req, res) => {
    const {groupId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({error: "No such group"});
    }

    try {
        const chat = await GroupChat.create({group: groupId});
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

//deleting a group chat
const deleteGroupChat = async (req, res) => {
    const {groupId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({error: "No such group"});
    }

    try {
        const chat = await GroupChat.findOneAndDelete({group: groupId});
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

//post new message
const postMessage = async (req, res) => {
    const {chatId} = req.params;
    const {sender, text} = req.body;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({error: "No such meetup"});
    }

    try {
        let message = await GroupMessages.create({
            chat: chatId,
            sender,
            text
        });

        message = await message.populate("sender");

        const chat = await GroupChat.findOneAndUpdate({_id: chatId}, { $push: {messages: message._id}});
        res.status(200).json(message);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {getGroupChat, createGroupChat, deleteGroupChat, postMessage};
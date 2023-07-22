const MeetupChat = require('../models/meetupChatModel');
const MeetupMessages = require('../models/meetupMessagesModel');
const mongoose = require('mongoose');

//get a meetup chat
const getMeetupChat = async (req, res) => {
    const { meetupId } = req.params;
    const chat = await MeetupChat.findOne({meetup: meetupId})
                                .populate("meetup")
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

//create a meetup chat
const createMeetupChat = async (req, res) => {
    const {meetupId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(meetupId)) {
        return res.status(400).json({error: "No such meetup"});
    }

    try {
        const chat = await MeetupChat.create({meetup: meetupId});
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

//deleting a meetup chat
const deleteMeetupChat = async (req, res) => {
    const {meetupId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(meetupId)) {
        return res.status(400).json({error: "No such meetup"});
    }

    try {
        const chat = await MeetupChat.findOneAndDelete({meetup: meetupId});
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
        return res.status(400).json({error: "No such chat"});
    }

    try {
        let message = await MeetupMessages.create({
            chat: chatId,
            sender,
            text
        });

        const newMessage = await MeetupMessages.findOne({_id: message._id}).populate("sender").populate("chat");

        const chat = await MeetupChat.findOneAndUpdate({_id: chatId}, { $push: {messages: message._id}});
        res.status(200).json(newMessage);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {getMeetupChat, createMeetupChat, deleteMeetupChat, postMessage};
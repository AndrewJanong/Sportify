const Friends = require('../models/friendsModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');


// Getting all friends
const getFriends = async (req, res) => {
    const friends = await Friends.find({});
    res.status(200).json(friends);
}

// Getting the frienship status with another user
const getFriendshipStatus = async (req, res) => {
    const userA = req.user._id.toString();
    const userB = req.params.userId;

    const friendshipStatus = await Friends.findOne({requester: userA, recipient: userB})
                                          .populate('requester')
                                          .populate('recipient');
    res.status(200).json(friendshipStatus);
}

// Getting all accepted friends of a user
const getUserFriends = async (req, res) => {
    const { userId } = req.params;

    const friends = await Friends.find({requester: userId, status: 3})
                                 .populate('requester')
                                 .populate('recipient');
    res.status(200).json(friends);
}

// Getting all requested friends of a user
const getUserRequested = async (req, res) => {
    const { userId } = req.params;

    const friends = await Friends.find({requester: userId, status: 1});
    res.status(200).json(friends);
}

// Getting all pending friends of a user
const getUserPending = async (req, res) => {
    const { userId } = req.params;

    const friends = await Friends.find({requester: userId, status: 2});
    res.status(200).json(friends);
}

// Sending a friend request
const sendFriendRequest = async (req, res) => {
    const { requester, recipient } = req.body;

    try {
        const docA = await Friends.create({
            requester,
            recipient,
            status: 1
        })

        const docB = await Friends.create({
            requester: recipient,
            recipient: requester,
            status: 2
        })
        res.status(200).json(docA);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

// Accepting a friend request
const acceptFriendRequest = async (req, res) => {
    const { requester, recipient } = req.body;

    try {
        const a = await Friends.findOneAndUpdate(
            { requester, recipient },
            { $set: { status: 3 }}
        )

        const b = await Friends.findOneAndUpdate(
            { requester: recipient, recipient: requester },
            { $set: { status: 3 }}
        )

        res.status(200).json(a);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

// Rejecting a friend request
const rejectFriendRequest = async (req, res) => {
    const { requester, recipient } = req.body;
 
    try {
        const docA = await Friends.findOneAndRemove(
            { requester, recipient }
        )
        const docB = await Friends.findOneAndRemove(
            { requester: recipient, recipient: requester }
        )
        res.status(200).json(docA);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

// Remove a friend
const removeFriend = async (req, res) => {
    const { requester, recipient } = req.body;

    try {
        const docA = await Friends.findOneAndRemove(
            { requester, recipient }
        )
        const docB = await Friends.findOneAndRemove(
            { requester: recipient, recipient: requester }
        )
        res.status(200).json(docA);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

module.exports = {
    getFriends,
    getFriendshipStatus,
    getUserFriends,
    getUserRequested,
    getUserPending,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend
}
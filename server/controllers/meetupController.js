const Meetups = require('../models/meetupModel');
const mongoose = require('mongoose');

//getting all Meetups
const getMeetups = async (req, res) => {
    const meetups = await Meetups.find({}).sort({createdAt: -1}).populate('members').populate('creator');
    res.status(200).json(meetups);
}

const getUserMeetups = async (req, res) => {
    const user_id = req.user._id;
    // const user_username = req.user.username;

    const meetups = await Meetups.find({members: user_id}).sort({createdAt: -1}).populate('members').populate('creator');
    // const meetups = await Meetups.find({members: user_username}).sort({createdAt: -1});
    res.status(200).json(meetups);
}

//getting a single Meetup
const getMeetup = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such meetup"});
    }

    const meetup = await Meetups.findById(id);

    if (!meetup) {
        return res.status(404).json({error: "No such meetup"});
    }

    res.status(200).json(meetup);
}

//post a single Meetup
const postMeetup = async (req, res) => {
    const {title, sports, date, location, members, vacancy, description, creator} = req.body;

    if (!(title && sports && date && location && members && vacancy && description)) {
        return res.status(400).json({error: 'Please fill in all fields'});
    }

    try {
        const user_id = req.user._id;
        const meetup = await Meetups.create({title, sports, date, location, members, vacancy, description, user_id, creator});
        res.status(200).json(meetup);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// adding a member to a Meetup
const addMember = async (req, res) => {
    const { id } = req.params;
    const { memberId } = req.body;

    const meetup = await Meetups.updateOne({_id: id}, {$push: {members: memberId}});
    res.status(200).json(meetup);
}

// removing a member from a Meetup
const removeMember = async (req, res) => {
    const { id } = req.params;
    const { memberId } = req.body;

    const meetup = await Meetups.updateOne({_id: id}, {$pull: {members: memberId}});
    res.status(200).json(meetup);
}


//deleting a Meetup
const deleteMeetup = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "No such meetup"});
    }

    const meetup = await Meetups.findOneAndDelete({_id: id});

    if (!meetup) {
        return res.status(400).json({error: "No such meetup"});
    }

    res.status(200).json(meetup);
}

//update a Meetup
const updateMeetup = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "No such meetup"});
    }

    const meetup = await Meetups.findOneAndUpdate({_id: id}, {...req.body});

    if (!meetup) {
        return res.status(400).json({error: "No such meetup"});
    }

    res.status(200).json(meetup);
}

module.exports = {getMeetups, getUserMeetups, getMeetup, postMeetup, addMember, removeMember, deleteMeetup, updateMeetup};

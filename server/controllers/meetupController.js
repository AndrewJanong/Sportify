const Meetups = require('../models/meetupModel');
const mongoose = require('mongoose');

//getting all Meetups
const getMeetups = async (req, res) => {
    const meetups = await Meetups.find({}).sort({createdAt: -1});
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
    const {title, sports, date, location, vacancy, description} = req.body;

    try {
        const meetup = await Meetups.create({title, sports, date, location, vacancy, description});
        res.status(200).json(meetup);
    } catch {
        res.status(400).json({error: error.message});
    }
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

module.exports = {getMeetups, getMeetup, postMeetup, deleteMeetup, updateMeetup};

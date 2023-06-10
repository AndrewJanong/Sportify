const Groups = require('../models/groupsModel');
const mongoose = require('mongoose');

// Get all groups
const getGroups = async (req, res) => {
    const groups = await Groups.find({});
    res.status(200).json(groups);
}

// Get user notifications
const getUserGroups = async (req, res) => {
    const { username } = req.params;

    const groups = await Groups.find({members: username});
    res.status(200).json(groups);
}

// Create a new group
const createGroup = async (req, res) => {
    const {name, sports, creator} = req.body;
    const members = [creator];

    try {
        const group = await Group.create({name, sports, members});
        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Delete a group
const deleteGroup = async (req, res) => {
    const { name } = req.params;
    const group = await Groups.findOneAndDelete({name});

    if (!group) {
        return res.status(400).json({error: "No such group"});
    }

    res.status(200).json(group);
}

module.exports = {
    getGroups,
    getUserGroups,
    createGroup,
    deleteGroup
}
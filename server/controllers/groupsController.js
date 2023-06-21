const Groups = require('../models/groupsModel');
const mongoose = require('mongoose');

// Get all groups
const getGroups = async (req, res) => {
    const groups = await Groups.find({});
    res.status(200).json(groups);
}

// Get group with specific id
const getGroup = async (req, res) => {
    const { id } = req.params;

    const group = await Groups.findOne({_id: id});
    res.status(200).json(group);
}

// Get user groups
const getUserGroups = async (req, res) => {
    const { username } = req.params;

    const groups = await Groups.find({members: username});
    res.status(200).json(groups);
}

// Create a new group
const createGroup = async (req, res) => {
    const {name, picture, sports, members} = req.body;

    if (!(name && picture && sports && members)) {
        return res.status(400).json({error: 'Please fill in all fields'});
    }

    try {
        const group = await Groups.create({name, picture, sports, members});
        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Edit a group
const updateGroup = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "No such group"});
    }

    const group = await Groups.findOneAndUpdate({_id: id}, {...req.body});

    if (!group) {
        return res.status(400).json({error: "No such group"});
    }

    res.status(200).json(group);
}

// Delete a group
const deleteGroup = async (req, res) => {
    const { id } = req.params;
    const group = await Groups.findOneAndDelete({_id: id});

    if (!group) {
        return res.status(400).json({error: "No such group"});
    }

    res.status(200).json(group);
}

// Add member to a group
const addMember = async (req, res) => {
    const { id } = req.params;
    const { member } = req.body;
    const group = await Groups.findOne({_id: id});

    if (!group) {
        return res.status(400).json({error: "No such group"});
    }

    if (group.members.includes(member)) {
        return res.status(400).json({error: "Member is already in group"});
    }

    const updated = await Groups.findOneAndUpdate({_id: id}, {members : [...group.members, member]});

    if (!updated) {
        return res.status(400).json({error: "Cannot add member to the group"});
    }

    res.status(200).json(updated);
}

// Remove member to a group
const removeMember = async (req, res) => {
    const { id } = req.params;
    const { member } = req.body;
    const group = await Groups.findOne({_id: id});

    if (!group) {
        return res.status(400).json({error: "No such group"});
    }

    if (!group.members.includes(member)) {
        return res.status(400).json({error: "Member is not in the group"});
    }

    const members = group.members.filter((m) => m !== member);

    const updated = await Groups.findOneAndUpdate({_id: id}, {members});

    if (!updated) {
        return res.status(400).json({error: "Cannot remove member from the group"});
    }

    res.status(200).json(updated);
}

module.exports = {
    getGroups,
    getGroup,
    getUserGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    addMember,
    removeMember
}
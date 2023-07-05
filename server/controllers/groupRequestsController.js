const GroupReqeusts = require('../models/groupRequestModel');
const mongoose = require('mongoose');

//getting all Requests
const getRequests = async (req, res) => {
    const requests = await GroupReqeusts.find({}).sort({createdAt: -1});
    res.status(200).json(requests);
}

const getUserRequests = async (req, res) => {
    const { userId } = req.params;
    const requests = await GroupReqeusts.find({target: userId}).sort({createdAt: -1});
    res.status(200).json(requests);
}

//post a single Request
const postRequest = async (req, res) => {
    const {group, target} = req.body;

    try {
        const request = await GroupReqeusts.create({group, target});
        res.status(200).json(request);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

//deleting a Request
const deleteRequest = async (req, res) => {
    const { groupId } = req.params;
    const target = req.user._id;

    const request = await GroupReqeusts.findOneAndDelete({groupId, target});

    if (!request) {
        return res.status(400).json({error: "No such meetup"});
    }

    res.status(200).json(request);
}

module.exports = {getRequests, getUserRequests, postRequest, deleteRequest};

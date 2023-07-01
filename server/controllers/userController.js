const User = require('../models/userModel');
const UserOTPVerification = require('../models/userOTPVerificationModel');
const bcrypt = require('bcrypt');
const validator = require('validator');

const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' });
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const username = user.username;
        const friends = user.friends;
        const userId = user._id;
        const picture = user.picture;
        const verified = user.verified;

        //create token
        const token = createToken(user._id);

        res.status(200).json({username, email, friends, picture, token, userId, verified});
    } catch (error) {
        res.status(400).json({error: error.message});
    }

}

const signupUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.signup(username, email, password);
        const friends = user.friends;
        const userId = user._id;
        const verified = false;

        //create token
        const token = createToken(user._id);

        res.status(200).json({username, email, friends, token, userId, verified});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const sendOTPVerificationEmail = async (req, res) => {
    const { username, email } = req.body;

    try {
        const verification = await UserOTPVerification.sendVerification(username, email);
        res.status(200).json(verification);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const verifyEmail = async (req, res) => {
    const { username, otp } = req.body;

    try {
        await UserOTPVerification.verify(username, otp);
        const user = await User.findOne({username, verified: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}
const resendOTPVerificationEmail = async (req, res) => {
    const { username, email } = req.body;

    try {
        await UserOTPVerification.deleteMany({username});
        const verification = await UserOTPVerification.sendVerification(username, email);
        res.status(200).json(verification);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getUsers = async (req, res) => {
    const users = await User.find({});

    if (!users) {
        res.status(400).json({error: 'User not found'});
        return;
    }
    res.status(200).json(users);
}

const getUserInfo = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({username});

    if (!user) {
        res.status(400).json({error: 'User not found'});
        return;
    }
    res.status(200).json(user);
}

const updateUserInfo = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOneAndUpdate({username}, {...req.body});
    if (!user) {
        res.status(400).json({error: 'User not found'})
        return;
    }
    res.status(200).json(user);
} 

module.exports = {
    loginUser,
    signupUser,
    sendOTPVerificationEmail,
    verifyEmail,
    resendOTPVerificationEmail,
    getUsers,
    getUserInfo,
    updateUserInfo
}
const User = require('../models/userModel');

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

        //create token
        const token = createToken(user._id);

        res.status(200).json({username, email, friends, picture, token, userId});
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

        //create token
        const token = createToken(user._id);

        res.status(200).json({username, email, friends, token, userId});
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
    getUsers,
    getUserInfo,
    updateUserInfo
}
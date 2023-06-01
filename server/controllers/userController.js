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

        //create token
        const token = createToken(user._id);

        res.status(200).json({username, email, friends, token, userId});
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

module.exports = {
    loginUser,
    signupUser
}
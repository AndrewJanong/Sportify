const User = require('../models/userModel');
const UserOTPVerification = require('../models/userOTPVerificationModel');
const bcrypt = require('bcrypt');
const validator = require('validator');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' });
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const username = user.username;
        const userId = user._id;
        const picture = user.picture;
        const verified = user.verified;

        //create token
        const token = createToken(user._id);

        res.status(200).json({username, email, picture, token, userId, verified});
    } catch (error) {
        res.status(400).json({error: error.message});
    }

}

const sendResetPasswordLink = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({email, verified: true});
        if (!user) {
            throw Error("User with given email doesn't exist");
        } else {
            const secret = process.env.SECRET + user._id + user.password;
            const payload = {
                email: user.email,
                id: user._id
            }

            const token = jwt.sign(payload, secret, {expiresIn: '15m'});
            const link = process.env.CLIENT_URL + `/reset-password/${user._id}/${token}`;

            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.AUTH_EMAIL,
                    pass: process.env.AUTH_PASS
                }
            })

            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: "Reset Sportify Account Password",
                html: `<p>Click this <a href=${link}>here</a> to reset your password. Link will expire in 15 minutes.</p>`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    throw Error("Unable to send reset password link");
                }
                console.log('Reset password link sent: %s', info.messageId);
            });
            
            res.status(200).json(user);
        }

    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({_id: id});

        if (!user) {
            throw Error("Invalid Id");
        }

        const secret = process.env.SECRET + user._id + user.password;

        const payload = jwt.verify(token, secret);

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const updatedUser = await User.findOneAndUpdate({_id: id}, {password: hash});
        res.status(200).json(updatedUser);

    } catch (error) {
        if (error.message === 'invalid signature' || error.message === 'jwt expired') {
            res.status(400).json({error: 'Link incorrect or has expired'});
        } else {
            res.status(400).json({error: error.message});
        }
        
    }
    
}

const signupUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.signup(username, email, password);
        const userId = user._id;
        const verified = false;

        //create token
        const token = createToken(user._id);

        res.status(200).json({username, email, token, userId, verified});
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
    const { userId } = req.params;
    const user = await User.findOne({_id: userId});

    if (!user) {
        res.status(400).json({error: 'User not found'});
        return;
    }
    res.status(200).json(user);
}

const getUserInfoFromUsername = async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({username: username});

    if (!user) {
        res.status(400).json({error: 'User not found'});
        return;
    }
    res.status(200).json(user);
}

const updateUserInfo = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findOneAndUpdate({_id: userId}, {...req.body});
    if (!user) {
        res.status(400).json({error: 'User not found'})
        return;
    }
    res.status(200).json(user);
} 

module.exports = {
    loginUser,
    sendResetPasswordLink,
    resetPassword,
    signupUser,
    sendOTPVerificationEmail,
    verifyEmail,
    resendOTPVerificationEmail,
    getUsers,
    getUserInfo,
    getUserInfoFromUsername,
    updateUserInfo
}
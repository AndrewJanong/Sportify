const express = require('express');

const {loginUser, sendResetPasswordLink, resetPassword, signupUser, sendOTPVerificationEmail, verifyEmail, resendOTPVerificationEmail, getUsers, getUserInfo, updateUserInfo} = require('../controllers/userController');

const router = express.Router();

router.post('/login', loginUser);

router.post('/send-reset', sendResetPasswordLink);

router.patch('/reset-password/:id/:token', resetPassword);

router.post('/signup', signupUser);

router.post('/send-verification', sendOTPVerificationEmail);

router.post('/verify', verifyEmail);

router.post('/resend-verification', resendOTPVerificationEmail);

router.get('/', getUsers);

router.get('/:username', getUserInfo);

router.patch('/:username', updateUserInfo);

module.exports = router;
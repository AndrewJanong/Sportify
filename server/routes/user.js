const express = require('express');

const {loginUser, signupUser, getUsers, getUserInfo, updateUserInfo} = require('../controllers/userController');

const router = express.Router();

router.post('/login', loginUser);

router.post('/signup', signupUser);

router.get('/', getUsers);

router.get('/:username', getUserInfo);

router.patch('/:username', updateUserInfo);

module.exports = router;
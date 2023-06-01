const express = require('express');
const 
{ 
    getFriends, 
    getUserFriends, 
    getUserRequested, 
    getUserPending, 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    removeFriend
} = require('../controllers/friendsController');

const router = express.Router();

router.get('/', getFriends);

router.get('/accepted/:username', getUserFriends);

router.get('/requested/:username', getUserRequested);

router.get('/pending/:username', getUserPending);

router.post('/request', sendFriendRequest);

router.patch('/accept', acceptFriendRequest);

router.patch('/reject', rejectFriendRequest);

router.patch('/remove', removeFriend);

module.exports = router;
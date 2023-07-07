const express = require('express');
const 
{ 
    getFriends,
    getFriendshipStatus,
    getUserFriends, 
    getUserRequested, 
    getUserPending, 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    removeFriend
} = require('../controllers/friendsController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get('/', getFriends);

router.get('/:userId', getFriendshipStatus);

router.get('/accepted/:userId', getUserFriends);

router.get('/requested/:userId', getUserRequested);

router.get('/pending/:userId', getUserPending);

router.post('/request', sendFriendRequest);

router.patch('/accept', acceptFriendRequest);

router.patch('/reject', rejectFriendRequest);

router.patch('/remove', removeFriend);

module.exports = router;
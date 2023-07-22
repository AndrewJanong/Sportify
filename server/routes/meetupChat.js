const express = require('express');
const 
{ 
    getMeetupChat,
    createMeetupChat,
    deleteMeetupChat,
    postMessage
} = require('../controllers/meetupChatController');

const router = express.Router();

router.get('/:meetupId', getMeetupChat);

router.post('/:meetupId', createMeetupChat);

router.delete('/:meetupId', deleteMeetupChat);

router.patch('/:chatId', postMessage);

module.exports = router;
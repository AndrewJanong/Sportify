const express = require('express');
const 
{ 
    getGroupChat,
    createGroupChat,
    deleteGroupChat,
    postMessage
} = require('../controllers/groupChatController');

const router = express.Router();

router.get('/:groupId', getGroupChat);

router.post('/:groupId', createGroupChat);

router.delete('/:groupId', deleteGroupChat);

router.patch('/:chatId', postMessage);

module.exports = router;
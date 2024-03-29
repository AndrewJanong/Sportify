const express = require('express');
const Discussions = require('../models/discussionModel');
const {getDiscussions, getDiscussion, postDiscussion, deleteDiscussion, updateDiscussion} = require('../controllers/discussionController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

// GET all discussions
router.get('/', getDiscussions);

// GET a single discussion
router.get('/:id', getDiscussion);
  
// POST a new discussion
router.post('/', postDiscussion);
  
// DELETE a discussion
router.delete('/:id', deleteDiscussion);

// UPDATE a discussion
router.patch('/:id', updateDiscussion);
  
module.exports = router;
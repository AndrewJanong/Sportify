const express = require('express');
const {getComments, getComment, postComment, deleteComment, updateComment} = require('../controllers/commentController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

// GET all discussions
router.get('/', getComments);

// GET a single discussion
router.get('/:id', getComment);
  
// POST a new discussion
router.post('/', postComment);
  
// DELETE a discussion
router.delete('/:id', deleteComment);

// UPDATE a discussion
router.patch('/:id', updateComment);
  
module.exports = router;
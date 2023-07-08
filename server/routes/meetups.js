const express = require('express');
const Meetups = require('../models/meetupModel');
const {getMeetups, getUserMeetups, getMeetup, postMeetup, addMember, removeMember, deleteMeetup, updateMeetup} = require('../controllers/meetupController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

// GET all meetups
router.get('/', getMeetups);

// GET user meetups
router.get('/user', getUserMeetups);
  
// GET a single meetup
router.get('/:id', getMeetup);
  
// POST a new meetup
router.post('/', postMeetup);

// add a new member
router.patch('/add-member/:id', addMember);

// remove a member
router.patch('/remove-member/:id', removeMember)
  
// DELETE a meetup
router.delete('/:id', deleteMeetup);
  
// UPDATE a meetup
router.patch('/:id', updateMeetup);

module.exports = router;
const express = require('express');
const Meetups = require('../models/meetupModel');
const {getMeetups, getMeetup, postMeetup, deleteMeetup, updateMeetup} = require('../controllers/meetupController');

const router = express.Router();

// GET all meetups
router.get('/', getMeetups);
  
// GET a single meetup
router.get('/:id', getMeetup);
  
// POST a new meetup
router.post('/', postMeetup);
  
// DELETE a meetup
router.delete('/:id', deleteMeetup);
  
// UPDATE a meetup
router.patch('/:id', updateMeetup);

module.exports = router;
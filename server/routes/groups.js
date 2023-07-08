const express = require('express');
const Groups = require('../models/groupsModel');
const {getGroups,
    getUserGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroup,
    addMember,
    removeMember} = require('../controllers/groupsController');

//const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

//router.use(requireAuth);

// GET all groups
router.get('/', getGroups);

// GET a group
router.get('/:id', getGroup);

// GET user groups
router.get('/user/:userId', getUserGroups);
  
// POST a new group
router.post('/', createGroup);

// PATCH a group
router.patch('/:id', updateGroup);
  
// DELETE a group
router.delete('/:id', deleteGroup);

// Add a member to the group
router.patch('/add_member/:id', addMember);

// Remove a member from the group
router.patch('/remove_member/:id', removeMember);

module.exports = router;
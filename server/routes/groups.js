const express = require('express');
const Groups = require('../models/groupsModel');
const {getGroups,
    getUserGroups,
    createGroup,
    deleteGroup} = require('../controllers/groupsController');

//const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

//router.use(requireAuth);

// GET all groups
router.get('/', getGroups);

// GET user groups
router.get('/:username', getUserGroups);
  
// POST a new group
router.post('/', createGroup);
  
// DELETE a group
router.delete('/:name', deleteGroup);

module.exports = router;
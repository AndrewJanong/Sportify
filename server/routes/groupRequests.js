const express = require('express');
const GroupReqeusts = require('../models/groupRequestModel');
const {getRequests, getUserRequests, postRequest, deleteRequest} = require('../controllers/groupRequestsController');

const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

// GET all requests
router.get('/', getRequests);

// GET user requests
router.get('/:userId', getUserRequests);
  
// POST a new request
router.post('/', postRequest);
  
// DELETE a request
router.delete('/:groupId', deleteRequest);

module.exports = router;
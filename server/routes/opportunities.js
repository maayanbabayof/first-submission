const express = require('express');
const { getOpportunities, getOpportunityById, checkRole, createOpportunity, deleteOpportunity } = require('../controller/opportunitiesController');
const { getUserOpportunities } = require('../controller/usersController');
const router = express.Router();

router.get('/all', getOpportunities);
router.get('/:id', getOpportunityById);
router.post('/create', checkRole(['farmer']), createOpportunity);
router.get('/user/:id', getUserOpportunities);
router.delete('/:id', deleteOpportunity);


module.exports = router;

const express = require('express');
const { getOpportunities, getOpportunityById, checkRole, createOpportunity } = require('../controller/opportunitiesController');
const router = express.Router();

router.get('/all', getOpportunities);
router.get('/:id', getOpportunityById);
router.post('/create', checkRole(['farmer']), createOpportunity);

module.exports = router;

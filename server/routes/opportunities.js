const express = require('express');
const { getOpportunities, getOpportunityById } = require('../controller/opportunitiesController');
const router = express.Router();

router.get('/all', getOpportunities);
router.get('/:id', getOpportunityById);

module.exports = router;

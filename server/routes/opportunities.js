const express = require('express');
const { getOpportunities } = require('../controller/opportunitiesController');
const router = express.Router();

router.get('/all', getOpportunities);

module.exports = router;

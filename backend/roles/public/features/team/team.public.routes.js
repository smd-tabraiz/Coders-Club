const express = require('express');
const router = express.Router();
const { getTeams, getTeamByBatch } = require('./team.public.controller');

router.get('/', getTeams);
router.get('/:batch', getTeamByBatch);

module.exports = router;

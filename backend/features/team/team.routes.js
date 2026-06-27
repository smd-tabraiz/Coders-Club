const express = require('express');
const router = express.Router();
const { getTeams, getTeamByBatch, createTeam, updateTeam, addMember, updateMember, removeMember } = require('./team.controller');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/roleGuard');

router.get('/', getTeams);
router.get('/:batch', getTeamByBatch);

// Protected admin commands
router.post('/', protect, authorize('admin', 'superadmin'), createTeam);
router.put('/:batch', protect, authorize('admin', 'superadmin'), updateTeam);
router.post('/:batch/member', protect, authorize('admin', 'superadmin'), addMember);
router.put('/:batch/member/:memberId', protect, authorize('admin', 'superadmin'), updateMember);
router.delete('/:batch/member/:memberId', protect, authorize('admin', 'superadmin'), removeMember);

module.exports = router;

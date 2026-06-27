const express = require('express');
const router = express.Router();
const { createTeam, updateTeam, addMember, removeMember } = require('./team.admin.controller');
const { protect } = require('../../../../middleware/auth');
const { authorize } = require('../../../../middleware/roleGuard');

// Protected admin commands
router.post('/', protect, authorize('admin', 'superadmin'), createTeam);
router.put('/:batch', protect, authorize('admin', 'superadmin'), updateTeam);
router.post('/:batch/member', protect, authorize('admin', 'superadmin'), addMember);
router.delete('/:batch/member/:memberId', protect, authorize('admin', 'superadmin'), removeMember);

module.exports = router;

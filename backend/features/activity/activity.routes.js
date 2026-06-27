const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('./activity.controller');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/roleGuard');

// Only superadmins can view activity logs
router.use(protect);
router.use(authorize('superadmin'));

router.get('/', getActivityLogs);

module.exports = router;

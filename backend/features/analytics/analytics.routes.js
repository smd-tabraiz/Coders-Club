const express = require('express');
const router = express.Router();
const { getOverviewStats, getMemberGrowth, getEventStats, getRevenueStats } = require('./analytics.controller');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/roleGuard');

router.use(protect);
router.use(authorize('admin', 'superadmin', 'member'));

router.get('/overview', getOverviewStats);
router.get('/member-growth', getMemberGrowth);
router.get('/events', getEventStats);
router.get('/revenue', getRevenueStats);

module.exports = router;

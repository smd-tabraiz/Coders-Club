const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('./setting.controller');
const { protect } = require('../../../../middleware/auth');
const { authorize } = require('../../../../middleware/roleGuard');

// Settings routes - Accessible by SuperAdmin and Admin
router.route('/')
  .get(protect, authorize('superadmin', 'admin'), getSettings)
  .put(protect, authorize('superadmin', 'admin'), updateSettings);

module.exports = router;

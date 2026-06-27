const express = require('express');
const router = express.Router();

const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
} = require('./event.admin.controller');

const { protect } = require('../../../../middleware/auth');
const { authorize } = require('../../../../middleware/roleGuard');
const { validateEvent } = require('../../../../middleware/validate');
const upload = require('../../../../middleware/upload');

// ─── Protected Routes (login required) ──────────────────────────

// Create Event — Admin or SuperAdmin only
router.post(
  '/',
  protect,
  authorize('admin', 'superadmin'),
  upload.single('banner'),
  validateEvent,
  createEvent
);

// Update Event — Admin or SuperAdmin only
router.put(
  '/:id',
  protect,
  authorize('admin', 'superadmin'),
  upload.single('banner'),
  updateEvent
);

// Delete Event — Admin or SuperAdmin only
router.delete(
  '/:id',
  protect,
  authorize('admin', 'superadmin'),
  deleteEvent
);

// Event Analytics — Admin or SuperAdmin only
router.get(
  '/:id/analytics',
  protect,
  authorize('admin', 'superadmin'),
  getEventAnalytics
);

module.exports = router;

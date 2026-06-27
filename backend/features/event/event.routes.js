const express = require('express');
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
  uploadResults,
} = require('./event.controller');

const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/roleGuard');
const { validateEvent } = require('../../middleware/validate');
const upload = require('../../middleware/upload');
const logActivity = require('../../middleware/activityLogger');

// ─── Public Routes (no login required) ──────────────────────────
router.get('/', getEvents);            // Anyone can browse events
router.get('/:id', getEventById);     // Anyone can view event details

// ─── Protected Routes (login required) ──────────────────────────

// Create Event — Admin or SuperAdmin only
router.post(
  '/',
  protect,
  authorize('admin', 'superadmin'),
  upload.single('banner'),
  validateEvent,
  logActivity('CREATE_EVENT', (req) => `Created event "${req.body.name}"`),
  createEvent
);

// Update Event — Admin or SuperAdmin only
router.put(
  '/:id',
  protect,
  authorize('admin', 'superadmin'),
  upload.single('banner'),
  logActivity('UPDATE_EVENT', (req) => `Updated event ID: ${req.params.id}`),
  updateEvent
);

// Delete Event — Admin or SuperAdmin only
router.delete(
  '/:id',
  protect,
  authorize('admin', 'superadmin'),
  logActivity('DELETE_EVENT', (req) => `Deleted event ID: ${req.params.id}`),
  deleteEvent
);

// Event Analytics — Admin or SuperAdmin only
router.get(
  '/:id/analytics',
  protect,
  authorize('admin', 'superadmin'),
  getEventAnalytics
);

router.post(
  '/:id/results',
  protect,
  authorize('admin', 'superadmin'),
  uploadResults
);

module.exports = router;

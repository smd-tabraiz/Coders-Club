const express = require('express');
const router = express.Router();

const {
  registerForEvent,
  getMyRegistrations,
  getAllRegistrations,
  updateRegistrationStatus,
  checkIn,
  submitFeedback,
  cancelRegistration,
} = require('./registration.controller');

const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/roleGuard');

// All registration routes require authentication
router.use(protect);

// ─── Student Routes ──────────────────────────────────────────────
// Register for an event
router.post('/', registerForEvent);

// Get the logged-in student's own registrations
router.get('/my', getMyRegistrations);

// Submit feedback for a completed event
router.post('/:id/feedback', submitFeedback);

// Cancel/withdraw a registration
router.delete('/:id', cancelRegistration);

// ─── Admin / SuperAdmin Routes ───────────────────────────────────
// Get ALL registrations (for admin dashboard)
router.get('/', authorize('superadmin', 'admin', 'member'), getAllRegistrations);

// Approve or reject a registration
router.patch('/:id/status', authorize('superadmin', 'admin'), updateRegistrationStatus);

// Check in a participant by ticket ID
router.post('/checkin', authorize('superadmin', 'admin'), checkIn);

module.exports = router;

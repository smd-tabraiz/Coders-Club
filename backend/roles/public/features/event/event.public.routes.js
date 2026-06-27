const express = require('express');
const router = express.Router();

const {
  getEvents,
  getEventById,
} = require('./event.public.controller');

// ─── Public Routes (no login required) ──────────────────────────
router.get('/', getEvents);            // Anyone can browse events
router.get('/:id', getEventById);     // Anyone can view event details

module.exports = router;

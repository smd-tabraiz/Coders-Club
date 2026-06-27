const express = require('express');
const router = express.Router();

const {
  getUserById,
  updateUser,
} = require('./user.student.controller');

const { protect } = require('../../../../middleware/auth');

router.use(protect);

// ─── Get Single User ──────────────────────────────────────────────
// Access: all authenticated (can only get own profile unless admin)
router.get('/:id', getUserById);

// ─── Update User Profile ──────────────────────────────────────────
// Access: own profile (any role), or superadmin for any user
router.put('/:id', updateUser);

module.exports = router;

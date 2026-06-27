const express = require('express');
const router = express.Router();

const {
  deleteUser,
  toggleActive,
  addSuperAdmin,
} = require('./user.superadmin.controller');

const { protect } = require('../../../../middleware/auth');
const { authorize } = require('../../../../middleware/roleGuard');

router.use(protect);

// ─── Add Super Admin ──────────────────────────────────────────────
// Access: superadmin only
router.post('/add-superadmin', authorize('superadmin'), addSuperAdmin);

// ─── Toggle User Active Status ────────────────────────────────────
// Access: superadmin only
router.patch('/:id/toggle-active', authorize('superadmin'), toggleActive);

// ─── Delete User ──────────────────────────────────────────────────
// Access: superadmin only. Cannot delete another superadmin.
router.delete('/:id', authorize('superadmin'), deleteUser);

module.exports = router;

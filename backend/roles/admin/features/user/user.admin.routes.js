const express = require('express');
const router = express.Router();

const {
  getUsers,
  searchUsers,
  addAdmin,
  changeUserRole,
} = require('./user.admin.controller');

const { protect } = require('../../../../middleware/auth');
const { authorize } = require('../../../../middleware/roleGuard');

router.use(protect);

// ─── Search Users ─────────────────────────────────────────────────
// Access: admin, superadmin, member (view-only search)
router.get('/search', searchUsers);

// ─── Get All Users ────────────────────────────────────────────────
// Access: admin, superadmin (manage), member (view-only)
router.get('/', authorize('superadmin', 'admin', 'member'), getUsers);

// ─── Add Admin Account ────────────────────────────────────────────
// Access: superadmin, admin (can both add admins, not delete)
router.post('/add-admin', authorize('superadmin', 'admin'), addAdmin);

// ─── Change User Role ─────────────────────────────────────────────
// Access: superadmin (any role), admin (only promote to admin)
router.patch('/:id/role', authorize('superadmin', 'admin'), changeUserRole);

module.exports = router;

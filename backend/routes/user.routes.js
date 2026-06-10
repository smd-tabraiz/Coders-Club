const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  addAdmin,
  toggleActive,
  searchUsers,
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleGuard');

// All user routes require authentication
router.use(protect);

// ─── Search Users ─────────────────────────────────────────────────
// Access: admin, superadmin, member (view-only search)
router.get('/search', searchUsers);

// ─── Get All Users ────────────────────────────────────────────────
// Access: admin, superadmin (manage), member (view-only)
router.get('/', authorize('superadmin', 'admin', 'member'), getUsers);

// ─── Get Single User ──────────────────────────────────────────────
// Access: all authenticated (can only get own profile unless admin)
router.get('/:id', getUserById);

// ─── Update User Profile ──────────────────────────────────────────
// Access: own profile (any role), or superadmin for any user
router.put('/:id', updateUser);

// ─── Add Admin Account ────────────────────────────────────────────
// Access: superadmin, admin (can both add admins, not delete)
router.post('/add-admin', authorize('superadmin', 'admin'), addAdmin);

// ─── Change User Role ─────────────────────────────────────────────
// Access: superadmin (any role), admin (only promote to admin)
router.patch('/:id/role', authorize('superadmin', 'admin'), changeUserRole);

// ─── Toggle User Active Status ────────────────────────────────────
// Access: superadmin only
router.patch('/:id/toggle-active', authorize('superadmin'), toggleActive);

// ─── Delete User ──────────────────────────────────────────────────
// Access: superadmin only. Cannot delete another superadmin.
router.delete('/:id', authorize('superadmin'), deleteUser);

module.exports = router;

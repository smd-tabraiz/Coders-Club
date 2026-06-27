const express = require('express');
const router = express.Router();
const {
  getApprovedReviews,
  getAllReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
} = require('./review.controller');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/roleGuard');
const upload = require('../../middleware/upload');

// Public routes
router.get('/', getApprovedReviews);
// Allow public review submission (optional login). Using multer for single image upload.
router.post('/', (req, res, next) => {
  // Try to authenticate if token exists, but don't fail if it doesn't
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    protect(req, res, () => upload.single('image')(req, res, next));
  } else {
    upload.single('image')(req, res, next);
  }
}, createReview);

// Admin routes
router.get('/admin', protect, authorize('admin', 'superadmin'), getAllReviews);
router.put('/:id/status', protect, authorize('admin', 'superadmin'), updateReviewStatus);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteReview);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getGallery, uploadMedia, deleteMedia } = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleGuard');
const upload = require('../middleware/upload');

router.get('/', getGallery);

// Protected admin upload commands
router.post('/upload', protect, authorize('admin', 'superadmin'), upload.single('media'), uploadMedia);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteMedia);

module.exports = router;

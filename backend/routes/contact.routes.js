const express = require('express');
const router = express.Router();
const { submitContact, getMessages } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleGuard');
const { validateContact } = require('../middleware/validate');

router.post('/', validateContact, submitContact);
router.get('/messages', protect, authorize('admin', 'superadmin'), getMessages);

module.exports = router;

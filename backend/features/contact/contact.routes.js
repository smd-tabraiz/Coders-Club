const express = require('express');
const router = express.Router();
const { submitContact, getMessages, resolveMessage, replyMessage } = require('./contact.controller');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/roleGuard');
const { validateContact } = require('../../middleware/validate');

router.post('/', validateContact, submitContact);
router.get('/messages', protect, authorize('admin', 'superadmin'), getMessages);
router.patch('/messages/:id/resolve', protect, authorize('admin', 'superadmin'), resolveMessage);
router.post('/messages/:id/reply', protect, authorize('admin', 'superadmin'), replyMessage);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getUserCertificates, createCertificate, deleteCertificate } = require('./certificate.controller');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/roleGuard');

router.use(protect);

router.get('/my', getUserCertificates);
router.post('/', authorize('admin', 'superadmin'), createCertificate);
router.delete('/:id', authorize('admin', 'superadmin'), deleteCertificate);

module.exports = router;

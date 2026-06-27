const express = require('express');
const router = express.Router();

// Import student feature routes
const userStudentRoutes = require('./features/user/user.student.routes');

// Mount student routes
router.use('/users', userStudentRoutes);

module.exports = router;

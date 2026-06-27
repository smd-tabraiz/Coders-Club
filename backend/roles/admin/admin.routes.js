const express = require('express');
const router = express.Router();

// Import admin feature routes
const eventAdminRoutes = require('./features/event/event.admin.routes');
const teamAdminRoutes = require('./features/team/team.admin.routes');
const userAdminRoutes = require('./features/user/user.admin.routes');

// Mount admin routes
router.use('/events', eventAdminRoutes);
router.use('/teams', teamAdminRoutes);
router.use('/users', userAdminRoutes);

module.exports = router;

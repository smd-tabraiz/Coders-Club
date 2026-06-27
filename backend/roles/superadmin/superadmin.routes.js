const express = require('express');
const router = express.Router();

// Import superadmin feature routes
const userSuperadminRoutes = require('./features/user/user.superadmin.routes');
const settingSuperadminRoutes = require('./features/settings/setting.routes');

// Mount superadmin routes
router.use('/users', userSuperadminRoutes);
router.use('/settings', settingSuperadminRoutes);

module.exports = router;

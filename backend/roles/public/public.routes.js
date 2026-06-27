const express = require('express');
const router = express.Router();

// Import public feature routes
const eventPublicRoutes = require('./features/event/event.public.routes');
const teamPublicRoutes = require('./features/team/team.public.routes');
const { getSettings } = require('../superadmin/features/settings/setting.controller');

// Mount public routes
router.use('/events', eventPublicRoutes);
router.use('/teams', teamPublicRoutes);
router.get('/settings', getSettings);

module.exports = router;

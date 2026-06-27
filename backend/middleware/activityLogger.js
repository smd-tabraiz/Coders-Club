const ActivityLog = require('../features/activity/activity.model');

// Middleware to log admin actions
const logActivity = (actionType, descriptionBuilder) => {
  return async (req, res, next) => {
    // We want to log AFTER the request finishes successfully.
    // So we hook into the response finish event.
    res.on('finish', async () => {
      // Only log if successful (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
            const description = typeof descriptionBuilder === 'function' 
              ? descriptionBuilder(req) 
              : descriptionBuilder;
              
            // targetId usually comes from req.params.id or req.params.batch etc.
            const targetId = req.params.id || req.params.batch || req.params.userId || '';

            await ActivityLog.create({
              adminId: req.user.id,
              action: actionType,
              description,
              targetId,
              ipAddress: req.ip || req.connection.remoteAddress,
            });
          }
        } catch (error) {
          console.error('Error logging activity:', error);
        }
      }
    });
    next();
  };
};

module.exports = logActivity;

const ActivityLog = require('./activity.model');

exports.getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const total = await ActivityLog.countDocuments();
    const logs = await ActivityLog.find()
      .populate('adminId', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: logs.length,
      total,
      page: parseInt(page),
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

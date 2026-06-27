const Setting = require('./setting.model');

// @desc    Get system settings
// @route   GET /api/superadmin/settings
// @access  Private/SuperAdmin
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update system settings
// @route   PUT /api/superadmin/settings
// @access  Private/SuperAdmin
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true,
      });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

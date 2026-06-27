const User = require('../../../../features/user/user.model');

// ─── Get Single User ───────────────────────────────────────────────────────
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// ─── Update User ───────────────────────────────────────────────────────────
// A user can update their own profile.
// Superadmin can update any user.
// Superadmin role cannot be changed by anyone (locked).
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Only superadmin or the user themselves can update
    const isSelf = req.user._id.toString() === req.params.id;
    const isSuperAdmin = req.user.role === 'superadmin';
    if (!isSelf && !isSuperAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this user' });
    }

    // Protect: superadmin role cannot be changed
    if (user.isSuperAdminLocked) {
      // Allow updating profile fields but NOT role
      delete req.body.role;
      delete req.body.isSuperAdminLocked;
    }

    // Non-superadmins cannot change their own role
    if (!isSuperAdmin) {
      delete req.body.role;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

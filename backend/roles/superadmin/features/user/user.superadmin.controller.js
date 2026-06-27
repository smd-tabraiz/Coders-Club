const User = require('../../../../features/user/user.model');

// ─── Add Super Admin ────────────────────────────────────────────────────────
exports.addSuperAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }
    const placeholderRollNo = `SUPERADMIN-${Date.now()}`;
    await User.create({
      name,
      email,
      password,
      rollNo: placeholderRollNo,
      department: 'Management',
      year: null,
      role: 'superadmin',
      isSuperAdminLocked: true,
      isActive: true
    });
    res.status(201).json({ success: true, message: 'Super Admin created successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Delete User ───────────────────────────────────────────────────────────
// Only superadmin can delete. Cannot delete another superadmin.
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deletion of any superadmin
    if (user.isSuperAdminLocked) {
      return res.status(403).json({ success: false, message: 'Super Admin account cannot be deleted' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User removed successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Toggle User Active Status ─────────────────────────────────────────────
// Only superadmin can deactivate users. Cannot deactivate superadmin.
exports.toggleActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isSuperAdminLocked) {
      return res.status(403).json({ success: false, message: 'Super Admin status cannot be changed' });
    }

    user.status = user.status === 'active' ? 'frozen' : 'active';
    await user.save();

    res.json({ success: true, data: user, message: `User ${user.status === 'active' ? 'activated' : 'frozen'}` });
  } catch (error) {
    next(error);
  }
};

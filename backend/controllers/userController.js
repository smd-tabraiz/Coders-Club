const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// ─── Get All Users ─────────────────────────────────────────────────────────
// Access: superadmin, admin, member (view-only)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, dept, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (dept) filter.department = dept;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

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

// ─── Change User Role ──────────────────────────────────────────────────────
// Superadmin: can change any role (except superadmin → anything else)
// Admin: can only promote to 'admin', cannot demote or delete admins
exports.changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const VALID_ROLES = ['student', 'member', 'admin'];

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be student, member, or admin' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Superadmin role is permanently locked — cannot be changed
    if (targetUser.isSuperAdminLocked) {
      return res.status(403).json({ success: false, message: 'Super Admin role is permanently locked and cannot be changed' });
    }

    // Admin can only assign 'admin' role (add admin), cannot downgrade/delete
    if (req.user.role === 'admin' && role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admins can only promote users to admin role' });
    }

    targetUser.role = role;
    await targetUser.save();

    res.json({ success: true, data: targetUser, message: `User role updated to ${role}` });
  } catch (error) {
    next(error);
  }
};

// ─── Add Admin ─────────────────────────────────────────────────────────────
// Superadmin or Admin can create a new admin account.
// The new account is always created with role = 'admin'.
exports.addAdmin = async (req, res, next) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Generate a placeholder rollNo for admin/faculty (not students)
    const placeholderRollNo = `ADMIN-${Date.now()}`;

    const admin = await User.create({
      name,
      email,
      password,
      rollNo: placeholderRollNo,
      department: department || 'Faculty',
      year: null,
      role: 'admin',
      isSuperAdminLocked: false,
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department,
      },
    });
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

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, data: user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (error) {
    next(error);
  }
};

// ─── Search Users ──────────────────────────────────────────────────────────
exports.searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { rollNo: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name email rollNo department role photo')
      .limit(10);

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

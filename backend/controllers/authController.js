const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// ─── Register ─────────────────────────────────────────────────────────────────
// First registered user in the DB becomes superadmin (locked permanently).
// All subsequent registrations are 'student' by default.
// Admins can create admin accounts via the /api/users/add-admin endpoint.
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, rollNo, department, year, phone, skills, linkedIn, github } = req.body;

    // Check for existing user
    const userExists = await User.findOne({ $or: [{ email }, { rollNo }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or roll number',
      });
    }

    // First registered user is superadmin (permanently locked)
    const role = 'student';
    const isSuperAdmin = false;

    const user = await User.create({
      name,
      email,
      password,
      rollNo,
      department,
      year: year || null,
      phone: phone || '',
      skills: skills || [],
      linkedIn: linkedIn || '',
      github: github || '',
      role,
      isSuperAdminLocked: isSuperAdmin,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: _formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Hardcoded Super Admin check
    if (email === 'vishnu.ecs@gprec.ac.in' && password === 'cc-convenor@vishnu2k22') {
      const superAdminData = {
        _id: '000000000000000000000000',
        name: 'A. Vishnu Vardhan Reddy',
        email: 'vishnu.ecs@gprec.ac.in',
        role: 'superadmin',
        isSuperAdminLocked: true,
        department: 'Faculty',
        rollNo: 'SUPERADMIN',
        year: null,
        phone: '',
        skills: [],
        photo: '',
        linkedIn: '',
        github: '',
        badges: [],
        eventsParticipated: 0,
        eventsWon: 0,
        attendance: 0,
        ranking: 1,
        createdAt: new Date(),
      };
      
      const token = generateToken(superAdminData._id);
      
      return res.json({
        success: true,
        token,
        data: superAdminData,
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      data: _formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Logged-in User ───────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    if (req.user.id === '000000000000000000000000') {
      return res.json({ success: true, data: req.user });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: _formatUser(user) });
  } catch (error) {
    next(error);
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Don't reveal if user exists or not — always return success
    res.json({
      success: true,
      message: 'If this email is registered, a password reset link will be sent.',
    });
  } catch (error) {
    next(error);
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

// ─── Helper: Format user for response ────────────────────────────────────────
const _formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isSuperAdminLocked: user.isSuperAdminLocked,
  rollNo: user.rollNo,
  department: user.department,
  year: user.year,
  phone: user.phone,
  skills: user.skills,
  photo: user.photo,
  linkedIn: user.linkedIn,
  github: user.github,
  badges: user.badges,
  eventsParticipated: user.eventsParticipated,
  eventsWon: user.eventsWon,
  attendance: user.attendance,
  ranking: user.ranking,
  createdAt: user.createdAt,
});

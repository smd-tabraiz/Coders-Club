const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    rollNo: {
      type: String,
      required: [true, 'Please add a roll number'],
      unique: true,
    },
    department: {
      type: String,
      required: [true, 'Please add a department'],
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CSD', 'CSM', 'CAI', 'Faculty', 'Management'],
    },
    year: {
      type: Number,
      // Not required for faculty/admin roles
      enum: [1, 2, 3, 4, null],
      default: null,
    },
    phone: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    photo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
    },
    linkedIn: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'member', 'student'],
      default: 'student',
    },
    // Superadmin role is permanently locked — cannot be changed after registration
    isSuperAdminLocked: {
      type: Boolean,
      default: false,
    },
    badges: [
      {
        name: String,
        icon: String,
        earnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    eventsParticipated: {
      type: Number,
      default: 0,
    },
    eventsWon: {
      type: Number,
      default: 0,
    },
    attendance: {
      type: Number,
      default: 100, // percentage
    },
    ranking: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

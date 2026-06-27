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
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CSD', 'CSM', 'CAI', 'Faculty', 'Management', 'ECS'],
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
      default: '',
    },
    socialLinks: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
      }
    ],
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'member', 'student'],
      default: 'student',
    },
    status: {
      type: String,
      enum: ['active', 'frozen'],
      default: 'active',
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
    experience: {
      type: Number,
      default: 0,
    },
    awards: {
      type: Number,
      default: 0,
    },
    publications: {
      type: Number,
      default: 0,
    },
    memberships: {
      type: String,
      default: '',
    },
    certificates: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

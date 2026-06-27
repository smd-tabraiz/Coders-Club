const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    rollNo: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    teamName: {
      type: String,
      default: '',
    },
    teamMembers: [
      {
        name: String,
        rollNo: String,
        branch: String,
        phone: String,
        email: String,
        year: Number,
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'registered', 'attended', 'absent', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['N/A', 'pending', 'completed', 'failed'],
      default: 'N/A',
    },
    transactionId: {
      type: String,
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
      },
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only register once per event
RegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);

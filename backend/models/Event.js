const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an event name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['workshop', 'hackathon', 'competition', 'seminar', 'webinar', 'other'],
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    venue: {
      type: String,
      required: [true, 'Please add a venue'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    time: {
      type: String,
      required: [true, 'Please add a time'],
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Please add max participants'],
    },
    coordinators: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
      },
    ],
    sponsors: [
      {
        name: String,
        logo: String,
      },
    ],
    rules: {
      type: [String],
      default: [],
    },
    resources: [
      {
        title: String,
        url: String,
      },
    ],
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
    revenue: {
      type: Number,
      default: 0,
    },
    results: [
      {
        position: { type: Number },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', EventSchema);

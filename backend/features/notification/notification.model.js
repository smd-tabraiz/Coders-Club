const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['event', 'registration', 'announcement', 'certificate', 'general', 'result', 'warning'],
      default: 'general',
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', NotificationSchema);

const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    // e.g., 'CREATE_EVENT', 'UPDATE_EVENT', 'DELETE_EVENT', 'VERIFY_PAYMENT', 'DELETE_MEMBER'
  },
  description: {
    type: String,
    required: true,
    // e.g., 'Deleted event "Code Sprint 2026"'
  },
  targetId: {
    type: String,
    // ID of the event, registration, or user that was affected
  },
  ipAddress: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);

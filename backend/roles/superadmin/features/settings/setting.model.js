const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema(
  {
    clubName: { type: String, default: 'Coders Club GPREC' },
    tagline: { type: String, default: 'Code. Build. Innovate.' },
    email: { type: String, default: 'codersclub@gprec.ac.in' },
    phone: { type: String, default: '+91 98765 43210' },
    college: { type: String, default: 'Gudlavalleru Engineering College (GPREC)' },
    website: { type: String, default: 'https://gprec.ac.in' },
    linkedIn: { type: String, default: 'https://linkedin.com/company/coders-club-gprec' },
    github: { type: String, default: 'https://github.com/coders-club-gprec' },
    instagram: { type: String, default: 'https://instagram.com/codersclub_gprec' },
    registrationOpen: { type: Boolean, default: true },
    allowGuestView: { type: Boolean, default: true },
    maxTeamSize: { type: Number, default: 5 },
    certificatePrefix: { type: String, default: 'CC-GPREC' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', SettingSchema);

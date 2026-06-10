const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema(
  {
    batch: {
      type: String,
      required: [true, 'Please add a batch year (e.g. 2027)'],
      unique: true,
    },
    groupPhoto: {
      type: String,
      default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: {
          type: String,
          required: true,
        },
        photo: {
          type: String,
          default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
        },
        position: {
          type: String,
          required: true, // e.g. President, Vice President, Tech Lead, Coordinator, Designer
        },
        role: {
          type: String,
          default: 'Core Member',
        },
        domain: {
          type: String, // Web Dev, Competitive Programming, Design, Content, Public Relations
        },
        skills: {
          type: [String],
          default: [],
        },
        linkedIn: String,
        github: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Team', TeamSchema);

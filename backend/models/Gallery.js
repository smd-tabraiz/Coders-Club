const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Please add image or video URL'],
    },
    thumbnail: {
      type: String,
    },
    caption: {
      type: String,
      required: [true, 'Please add a caption'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['workshops', 'hackathons', 'competitions', 'club_activities'],
    },
    type: {
      type: String,
      enum: ['photo', 'video'],
      default: 'photo',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Gallery', GallerySchema);

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    authorDept: {
      type: String,
      default: 'Coders Club Member',
      trim: true,
    },
    text: {
      type: String,
      required: [true, 'Review text is required'],
      maxlength: [500, 'Review cannot exceed 500 characters'],
    },
    image: {
      type: String,
      default: null, // URL for attached picture
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Optional if submitted by logged-in user
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);

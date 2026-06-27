const Review = require('./review.model');

// @desc    Get all approved reviews (Public)
// @route   GET /api/reviews
exports.getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (Admin only)
// @route   GET /api/reviews/admin
exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review (Public/Logged in)
// @route   POST /api/reviews
exports.createReview = async (req, res, next) => {
  try {
    const { authorName, authorDept, text } = req.body;
    let image = null;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const review = await Review.create({
      authorName,
      authorDept,
      text,
      image,
      user: req.user ? req.user._id : null,
      status: 'pending' // always pending initially
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review status (Admin only)
// @route   PUT /api/reviews/:id/status
exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review (Admin only)
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

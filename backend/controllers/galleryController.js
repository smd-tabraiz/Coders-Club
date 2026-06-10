const Gallery = require('../models/Gallery');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.getGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category.toLowerCase().replace(' ', '_');

    const items = await Gallery.find(filter).populate('uploadedBy', 'name').sort('-createdAt');
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const url = await uploadToCloudinary(req.file.buffer, 'gallery');

    const media = await Gallery.create({
      url,
      caption: req.body.caption,
      category: req.body.category,
      type: req.body.type || 'photo',
      uploadedBy: req.user.id,
    });

    res.status(201).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Gallery.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    await media.deleteOne();
    res.json({ success: true, message: 'Media removed from gallery' });
  } catch (error) {
    next(error);
  }
};

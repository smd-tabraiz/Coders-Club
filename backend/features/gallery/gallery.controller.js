const Gallery = require('./gallery.model');
const { uploadToCloudinary } = require('../../utils/cloudinary');

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
    const files = req.files || (req.file ? [req.file] : []);
    
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one file' });
    }

    const uploadPromises = files.map(async (file) => {
      const url = await uploadToCloudinary(file.buffer, 'gallery');
      return {
        url,
        caption: req.body.caption,
        category: req.body.category,
        type: req.body.type || 'photo',
        uploadedBy: req.user.id,
      };
    });

    const galleryDocs = await Promise.all(uploadPromises);
    const media = await Gallery.insertMany(galleryDocs);

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

const Certificate = require('../models/Certificate');

exports.getUserCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ userId: req.user.id }).populate('eventId');
    res.json({ success: true, data: certificates });
  } catch (error) {
    next(error);
  }
};

exports.createCertificate = async (req, res, next) => {
  try {
    const { userId, eventId, title, url } = req.body;
    const cert = await Certificate.create({ userId, eventId, title, url });
    res.status(201).json({ success: true, data: cert });
  } catch (error) {
    next(error);
  }
};

exports.deleteCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    await cert.deleteOne();
    res.json({ success: true, message: 'Certificate removed' });
  } catch (error) {
    next(error);
  }
};

const ContactMessage = require('../models/ContactMessage');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const msg = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent successfully', data: msg });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find({}).sort('-createdAt');
    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

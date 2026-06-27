const ContactMessage = require('./contact.model');

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

exports.resolveMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    message.status = 'resolved';
    await message.save();

    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

exports.replyMessage = async (req, res, next) => {
  try {
    const { reply } = req.body;
    if (!reply) {
      return res.status(400).json({ success: false, message: 'Reply text is required' });
    }

    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.reply = reply;
    message.repliedBy = req.user._id;
    message.status = 'resolved';
    await message.save();

    // Find if a user exists with this email to send an in-app notification
    const User = require('../user/user.model');
    const targetUser = await User.findOne({ email: message.email });
    
    if (targetUser) {
      const Notification = require('../notification/notification.model');
      await Notification.create({
        userId: targetUser._id,
        title: 'Reply to your Contact Query',
        message: `Admin replied: "${reply}"\n\nOriginal Query: "${message.subject}"`,
        type: 'general'
      });
    }

    // Send actual email to the user
    const sendEmail = require('../../utils/sendEmail');
    try {
      await sendEmail({
        email: message.email,
        subject: `RE: ${message.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #6366f1;">Coders Club Support</h2>
            <p>Hi ${message.name},</p>
            <p>An admin has replied to your recent query:</p>
            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #6366f1; margin: 20px 0;">
              <strong>Reply:</strong><br/>
              <span style="white-space: pre-wrap;">${reply}</span>
            </div>
            <p style="color: #64748b; font-size: 14px;">Original Query: <em>${message.subject}</em></p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #94a3b8;">This is an automated message. Please do not reply directly to this email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email could not be sent:', emailError);
      // We don't fail the request if email fails, because we already saved the reply
    }

    res.json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

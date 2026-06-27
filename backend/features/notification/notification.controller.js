const Notification = require('./notification.model');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort('-createdAt');
    const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false });
    res.json({ success: true, unreadCount, data: notifications });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    const { title, message, type, target, link } = req.body;
    const User = require('../user/user.model');
    
    let query = {};
    if (Array.isArray(target) && !target.includes('All')) {
      const roles = [];
      if (target.includes('Admins')) roles.push('admin', 'superadmin');
      if (target.includes('Members')) roles.push('member');
      if (target.includes('users') || target.includes('Users')) roles.push('student');
      
      if (roles.length > 0) {
        query = { role: { $in: roles } };
      }
    } else if (typeof target === 'string' && target !== 'All Members' && target !== 'All') {
      // Fallback for old string format
      if (target === 'Members Only') query = { role: { $in: ['student', 'member'] } };
      if (target === 'Admins Only') query = { role: { $in: ['admin', 'superadmin'] } };
    }

    const users = await User.find(query).select('_id');
    const notifications = users.map(user => ({
      userId: user._id,
      title: title || 'Notification',
      message,
      type: type || 'general',
      link
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      
      try {
        const socket = require('../../socket');
        const io = socket.getIo();
        notifications.forEach(n => {
          io.to(n.userId.toString()).emit('newNotification', { title: n.title, message: n.message, type: n.type });
        });
      } catch (err) {
        console.error('Socket error emitting notifications', err);
      }
    }

    res.status(201).json({ success: true, count: notifications.length });
  } catch (error) {
    next(error);
  }
};

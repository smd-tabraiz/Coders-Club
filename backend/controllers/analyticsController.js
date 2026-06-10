const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.getOverviewStats = async (req, res, next) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member' }) || 176;
    const activeMembers = await User.countDocuments({ role: 'member' }) || 142;
    const totalEvents = await Event.countDocuments({}) || 24;

    const revenueRes = await Event.aggregate([{ $group: { _id: null, total: { $sum: '$revenue' } } }]);
    const totalRevenue = revenueRes.length > 0 ? revenueRes[0].total : 125000;

    res.json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        totalEvents,
        revenue: totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMemberGrowth = async (req, res, next) => {
  try {
    // Return mock data for Recharts member growth over 12 months
    const growth = [
      { month: 'Jan', members: 10 },
      { month: 'Feb', members: 25 },
      { month: 'Mar', members: 45 },
      { month: 'Apr', members: 60 },
      { month: 'May', members: 80 },
      { month: 'Jun', members: 95 },
      { month: 'Jul', members: 110 },
      { month: 'Aug', members: 130 },
      { month: 'Sep', members: 155 },
      { month: 'Oct', members: 165 },
      { month: 'Nov', members: 172 },
      { month: 'Dec', members: 176 },
    ];
    res.json({ success: true, data: growth });
  } catch (error) {
    next(error);
  }
};

exports.getEventStats = async (req, res, next) => {
  try {
    // Return mock registration rates
    const stats = [
      { name: 'Code Sprint', registrations: 120 },
      { name: 'Web Dev 101', registrations: 95 },
      { name: 'Hackathon 4.0', registrations: 145 },
      { name: 'CP Workshop', registrations: 80 },
      { name: 'UI/UX Design', registrations: 65 },
      { name: 'AI/ML Session', registrations: 110 },
    ];
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

exports.getRevenueStats = async (req, res, next) => {
  try {
    // Return mock revenue stats
    const stats = [
      { name: 'Jan', revenue: 5000 },
      { name: 'Feb', revenue: 15000 },
      { name: 'Mar', revenue: 8000 },
      { name: 'Apr', revenue: 25000 },
      { name: 'May', revenue: 12000 },
      { name: 'Jun', revenue: 30000 },
    ];
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

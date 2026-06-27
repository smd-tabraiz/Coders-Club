const User = require('../user/user.model');
const Event = require('../event/event.model');
const Registration = require('../registration/registration.model');

exports.getOverviewStats = async (req, res, next) => {
  try {
    const totalMembers = await User.countDocuments({ role: { $in: ['member', 'student'] } }) || 0;
    const activeMembers = await User.countDocuments({ role: 'member' }) || 0;
    const totalEvents = await Event.countDocuments({}) || 0;

    const revenueRes = await Event.aggregate([{ $group: { _id: null, total: { $sum: '$revenue' } } }]);
    const totalRevenue = revenueRes.length > 0 ? revenueRes[0].total : 0;

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

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

exports.getMemberGrowth = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const growth = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    let cumulative = 0;
    const formattedGrowth = monthNames.map((name, index) => {
      const monthData = growth.find(g => g._id === index + 1);
      cumulative += (monthData ? monthData.count : 0);
      return {
        month: name,
        members: cumulative
      };
    });

    res.json({ success: true, data: formattedGrowth });
  } catch (error) {
    next(error);
  }
};

exports.getEventStats = async (req, res, next) => {
  try {
    const stats = await Registration.aggregate([
      {
        $group: {
          _id: "$eventId",
          registrations: { $sum: 1 }
        }
      },
      { $sort: { registrations: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: "$event" },
      {
        $project: {
          name: "$event.name",
          registrations: 1,
          _id: 0
        }
      }
    ]);
    
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

exports.getRevenueStats = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const revStats = await Event.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$date" },
          revenue: { $sum: "$revenue" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formattedRevenue = monthNames.map((name, index) => {
      const monthData = revStats.find(g => g._id === index + 1);
      return {
        name,
        revenue: monthData ? monthData.revenue : 0
      };
    });

    res.json({ success: true, data: formattedRevenue });
  } catch (error) {
    next(error);
  }
};

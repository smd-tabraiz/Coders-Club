const Team = require('../../../../features/team/team.model');

exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({}).sort('-batch');
    res.json({ success: true, count: teams.length, data: teams });
  } catch (error) {
    next(error);
  }
};

exports.getTeamByBatch = async (req, res, next) => {
  try {
    const team = await Team.findOne({ batch: req.params.batch });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team batch not found' });
    }
    res.json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

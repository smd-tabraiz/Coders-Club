const Team = require('../../../../features/team/team.model');

exports.createTeam = async (req, res, next) => {
  try {
    const { batch, groupPhoto, members } = req.body;

    const existingTeam = await Team.findOne({ batch });
    if (existingTeam) {
      return res.status(400).json({ success: false, message: 'Team batch already exists' });
    }

    const team = await Team.create({ batch, groupPhoto, members: members || [] });
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

exports.updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findOneAndUpdate({ batch: req.params.batch }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team batch not found' });
    }

    res.json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const team = await Team.findOne({ batch: req.params.batch });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team batch not found' });
    }

    team.members.push(req.body);
    await team.save();

    res.json({ success: true, message: 'Member added to team', data: team });
  } catch (error) {
    next(error);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const team = await Team.findOne({ batch: req.params.batch });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team batch not found' });
    }

    team.members = team.members.filter(m => m._id.toString() !== req.params.memberId);
    await team.save();

    res.json({ success: true, message: 'Member removed from team', data: team });
  } catch (error) {
    next(error);
  }
};

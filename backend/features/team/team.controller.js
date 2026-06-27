const Team = require('./team.model');
const { uploadToCloudinary } = require('../../utils/cloudinary');

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

exports.createTeam = async (req, res, next) => {
  try {
    const { batch, groupPhoto, members } = req.body;

    const existingTeam = await Team.findOne({ batch });
    if (existingTeam) {
      return res.status(400).json({ success: false, message: 'Team batch already exists' });
    }

    let processedMembers = members || [];
    for (let i = 0; i < processedMembers.length; i++) {
      if (processedMembers[i].photo && processedMembers[i].photo.startsWith('data:image')) {
        const base64Data = processedMembers[i].photo.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        processedMembers[i].photo = await uploadToCloudinary(buffer, 'teams');
      }
    }

    const team = await Team.create({ batch, groupPhoto, members: processedMembers });
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

    let memberData = req.body;
    if (memberData.photo && memberData.photo.startsWith('data:image')) {
      const base64Data = memberData.photo.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      memberData.photo = await uploadToCloudinary(buffer, 'teams');
    }

    team.members.push(memberData);
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

exports.updateMember = async (req, res, next) => {
  try {
    const team = await Team.findOne({ batch: req.params.batch });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team batch not found' });
    }

    const member = team.members.id(req.params.memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    let updateData = req.body;
    if (updateData.photo && updateData.photo.startsWith('data:image')) {
      const base64Data = updateData.photo.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      updateData.photo = await uploadToCloudinary(buffer, 'teams');
    } else if (updateData.photo === '') {
      // If photo was explicitly cleared
      updateData.photo = '';
    }

    // Apply updates
    Object.keys(updateData).forEach(key => {
      member[key] = updateData[key];
    });

    await team.save();

    res.json({ success: true, message: 'Member updated', data: team });
  } catch (error) {
    next(error);
  }
};

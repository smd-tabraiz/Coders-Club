const Registration = require('./registration.model');
const Event = require('../event/event.model');
const generateTicketId = require('../../utils/generateTicket');

// ─── Register for an Event ────────────────────────────────────────────────────
// Access: student, member (any logged-in user)
exports.registerForEvent = async (req, res, next) => {
  try {
    const { event: eventId, teamName, teamMembers, transactionId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Registrations are closed for this event' });
    }

    // Check allowed years constraint
    if (event.allowedYears && event.allowedYears.length > 0) {
      const allowed = event.allowedYears;
      
      // Check the team lead (the person registering)
      if (req.user.year && !allowed.includes(Number(req.user.year))) {
        return res.status(400).json({ 
          success: false, 
          message: `Your academic year (Year ${req.user.year}) is not eligible for this event. Allowed years: ${allowed.join(', ')}` 
        });
      }

      // Check all team members if it's a team registration
      if (teamMembers && teamMembers.length > 0) {
        for (const member of teamMembers) {
          if (member.year && !allowed.includes(Number(member.year))) {
            return res.status(400).json({ 
              success: false, 
              message: `Team member ${member.name} (Year ${member.year}) is not eligible. Allowed years: ${allowed.join(', ')}` 
            });
          }
        }
      }
    }

    // Check max fourth years constraint
    if (event.teamSize > 1 && event.maxFourthYears !== null && event.maxFourthYears !== undefined) {
      let fourthYearCount = 0;
      if (Number(req.user.year) === 4) fourthYearCount++;
      
      if (teamMembers && teamMembers.length > 0) {
        for (const member of teamMembers) {
          if (Number(member.year) === 4) fourthYearCount++;
        }
      }

      if (fourthYearCount > event.maxFourthYears) {
        return res.status(400).json({
          success: false,
          message: `This team has ${fourthYearCount} 4th-year student(s). The maximum allowed per team for this event is ${event.maxFourthYears}.`
        });
      }
    }

    // Check if user already registered
    const existing = await Registration.findOne({ userId: req.user.id, eventId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already registered for this event' });
    }

    // Check seat availability
    const count = await Registration.countDocuments({ eventId });
    if (event.maxParticipants && count >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Event is fully booked' });
    }

    // Payment validation
    let paymentStatus = 'N/A';
    if (event.registrationFee > 0) {
      if (!transactionId) {
        return res.status(400).json({ success: false, message: 'Transaction ID is required for paid events' });
      }
      paymentStatus = 'completed'; // As requested for instant updates Option B
    }

    const ticketId = generateTicketId();

    const registration = await Registration.create({
      userId: req.user.id,
      eventId,
      ticketId,
      // Pull details from user profile automatically
      name: req.user.name,
      rollNo: req.user.rollNo,
      branch: req.user.department,
      year: req.user.year,
      phone: req.user.phone,
      email: req.user.email,
      teamName: teamName || '',
      teamMembers: teamMembers || [],
      status: (paymentStatus === 'completed' || paymentStatus === 'N/A') ? 'completed' : 'pending',
      paymentStatus,
      transactionId: transactionId || undefined,
    });

    // Update event revenue
    if (event.registrationFee > 0 && paymentStatus === 'completed') {
      const multiplier = event.teamSize > 1 ? (1 + (teamMembers?.length || 0)) : 1;
      event.revenue = (event.revenue || 0) + (event.registrationFee * multiplier);
      await event.save();
    }

    try {
      const socket = require('../../socket');
      const io = socket.getIo();
      // Notify admins and members that a new registration occurred to update dashboard stats
      io.to('role:admin').to('role:superadmin').to('role:member').emit('registrationUpdated');
    } catch (err) {
      console.error('Socket error emitting registration update', err);
    }

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    next(error);
  }
};

// ─── Get My Registrations ─────────────────────────────────────────────────────
// Access: logged-in user (returns only their own registrations)
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ userId: req.user.id })
      .populate('eventId', 'name date venue category banner status')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: registrations });
  } catch (error) {
    next(error);
  }
};

// ─── Get All Registrations ────────────────────────────────────────────────────
// Access: superadmin, admin, member (read-only for members)
exports.getAllRegistrations = async (req, res, next) => {
  try {
    const { event, status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (event) filter.eventId = event;
    if (status) filter.status = status;

    const total = await Registration.countDocuments(filter);
    const registrations = await Registration.find(filter)
      .populate('eventId', 'name date venue category status banner')
      .populate('userId', 'name email rollNo department year photo')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: registrations.length,
      total,
      page: parseInt(page),
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Update Registration Status ───────────────────────────────────────────────
// Access: admin, superadmin only
exports.updateRegistrationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const VALID_STATUSES = ['pending', 'approved', 'rejected', 'attended'];

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    try {
      const socket = require('../../socket');
      const io = socket.getIo();
      io.to(registration.userId.toString()).emit('registrationStatusChanged', { status, eventId: registration.eventId });
      io.to('role:admin').to('role:superadmin').to('role:member').emit('registrationUpdated');
    } catch (err) {
      console.error('Socket error emitting registration update', err);
    }

    res.json({ success: true, data: registration, message: `Registration ${status} successfully` });
  } catch (error) {
    next(error);
  }
};

// ─── Cancel Registration ──────────────────────────────────────────────────────
// Access: the user who created it, or admin/superadmin
exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    const isOwner = registration.userId.toString() === req.user.id;
    const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this registration' });
    }

    await registration.deleteOne();
    res.json({ success: true, message: 'Registration cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Check In Participant ─────────────────────────────────────────────────────
// Access: admin, superadmin only
exports.checkIn = async (req, res, next) => {
  try {
    const { ticketId } = req.body;
    const registration = await Registration.findOne({ ticketId }).populate('eventId');
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Invalid ticket ID' });
    }

    if (registration.checkedIn) {
      return res.status(400).json({ success: false, message: 'Participant already checked in' });
    }

    registration.checkedIn = true;
    registration.status = 'attended';
    await registration.save();

    res.json({ success: true, message: 'Check-in successful', data: registration });
  } catch (error) {
    next(error);
  }
};

// ─── Submit Feedback ──────────────────────────────────────────────────────────
// Access: the user who registered
exports.submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (registration.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to submit feedback for this registration' });
    }

    registration.feedback = { rating, comment };
    await registration.save();

    res.json({ success: true, message: 'Feedback submitted successfully', data: registration });
  } catch (error) {
    next(error);
  }
};

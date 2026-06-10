const Registration = require('../models/Registration');
const Event = require('../models/Event');
const generateTicketId = require('../utils/generateTicket');

// ─── Register for an Event ────────────────────────────────────────────────────
// Access: student, member (any logged-in user)
exports.registerForEvent = async (req, res, next) => {
  try {
    const { event: eventId, teamName, teamMembers } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Registrations are closed for this event' });
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
      status: 'pending',
    });

    // Update event revenue
    if (event.registrationFee) {
      event.revenue = (event.revenue || 0) + event.registrationFee;
      await event.save();
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
      .populate('eventId', 'title date venue category banner status')
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
      .populate('eventId', 'title date venue category')
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

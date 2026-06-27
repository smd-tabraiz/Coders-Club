const Event = require('./event.model');
const { uploadToCloudinary } = require('../../utils/cloudinary');

exports.getEvents = async (req, res, next) => {
  try {
    // Automatically transition past events to 'completed'
    await Event.updateMany(
      { status: 'upcoming', date: { $lt: new Date() } },
      { $set: { status: 'completed' } }
    );

    const { category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const events = await Event.find(filter).populate('createdBy', 'name').sort('-date');
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    next(error);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    let bannerUrl;
    if (req.file) {
      bannerUrl = await uploadToCloudinary(req.file.buffer, 'banners');
    }

    const eventData = {
      ...req.body,
      createdBy: req.user.id,
    };

    if (bannerUrl) {
      eventData.banner = bannerUrl;
    }

    // Parse sub arrays if sent as strings (typical in multipart form-data)
    if (typeof req.body.coordinators === 'string') {
      eventData.coordinators = JSON.parse(req.body.coordinators);
    }
    if (typeof req.body.rules === 'string') {
      eventData.rules = JSON.parse(req.body.rules);
    }
    if (typeof req.body.sponsors === 'string') {
      eventData.sponsors = JSON.parse(req.body.sponsors);
    }
    if (typeof req.body.resources === 'string') {
      eventData.resources = JSON.parse(req.body.resources);
    }
    if (typeof req.body.allowedYears === 'string') {
      eventData.allowedYears = JSON.parse(req.body.allowedYears);
    }

    const event = await Event.create(eventData);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    let bannerUrl;
    if (req.file) {
      bannerUrl = await uploadToCloudinary(req.file.buffer, 'banners');
    }

    const updateData = { ...req.body };
    if (bannerUrl) {
      updateData.banner = bannerUrl;
    }

    if (typeof req.body.coordinators === 'string') {
      updateData.coordinators = JSON.parse(req.body.coordinators);
    }
    if (typeof req.body.rules === 'string') {
      updateData.rules = JSON.parse(req.body.rules);
    }
    if (typeof req.body.sponsors === 'string') {
      updateData.sponsors = JSON.parse(req.body.sponsors);
    }
    if (typeof req.body.resources === 'string') {
      updateData.resources = JSON.parse(req.body.resources);
    }
    if (typeof req.body.allowedYears === 'string') {
      updateData.allowedYears = JSON.parse(req.body.allowedYears);
    }

    event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getEventAnalytics = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Mock analytics
    res.json({
      success: true,
      data: {
        eventId: event._id,
        registrationsCount: Math.floor(Math.random() * 50) + 10,
        revenue: event.registrationFee * (Math.floor(Math.random() * 50) + 10),
        attendanceRate: Math.floor(Math.random() * 40) + 60, // percentage
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadResults = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const { results } = req.body;
    if (!Array.isArray(results)) {
      return res.status(400).json({ success: false, message: 'Results must be an array' });
    }

    event.results = results;
    await event.save();

    res.json({ success: true, message: 'Results uploaded successfully', data: event });
  } catch (error) {
    next(error);
  }
};

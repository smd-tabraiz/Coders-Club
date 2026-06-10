const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  body('rollNo', 'Roll number is required').notEmpty(),
  body('department', 'Department is required').notEmpty(),
  body('year', 'Year must be 1, 2, 3 or 4').isInt({ min: 1, max: 4 }),
  body('phone', 'Phone number is required').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

const validateEvent = [
  body('name', 'Event name is required').notEmpty(),
  body('category', 'Invalid category').isIn(['workshop', 'hackathon', 'competition', 'seminar', 'webinar', 'other']),
  body('description', 'Description is required').notEmpty(),
  body('venue', 'Venue is required').notEmpty(),
  body('date', 'Valid date is required').isISO8601(),
  body('time', 'Time is required').notEmpty(),
  body('maxParticipants', 'Maximum participants must be a number').isInt({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

const validateContact = [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('subject', 'Subject is required').notEmpty(),
  body('message', 'Message is required').notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateRegister,
  validateLogin,
  validateEvent,
  validateContact,
};

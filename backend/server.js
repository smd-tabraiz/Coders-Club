const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Import Route Files
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/event.routes');
const registrationRoutes = require('./routes/registration.routes');
const teamRoutes = require('./routes/team.routes');
const galleryRoutes = require('./routes/gallery.routes');
const certificateRoutes = require('./routes/certificate.routes');
const notificationRoutes = require('./routes/notification.routes');
const contactRoutes = require('./routes/contact.routes');
const analyticsRoutes = require('./routes/analytics.routes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);

// Optional Seeding Route (Helper for first run)
app.post('/api/seed', async (req, res, next) => {
  try {
    const User = require('./models/User');
    const Event = require('./models/Event');
    const Team = require('./models/Team');
    const Gallery = require('./models/Gallery');

    // Clean up
    await User.deleteMany({ role: { $ne: 'superadmin' } });
    await Event.deleteMany({});
    await Team.deleteMany({});
    await Gallery.deleteMany({});

    // Seed mock team batch 2026
    await Team.create({
      batch: '2026',
      groupPhoto: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
      members: [
        {
          name: 'Anish Reddy',
          position: 'President',
          role: 'Club Head',
          domain: 'Competitive Programming',
          skills: ['C++', 'DSA', 'Algorithms'],
          linkedIn: 'https://linkedin.com',
          github: 'https://github.com',
        },
        {
          name: 'Sai Kiran',
          position: 'Vice President',
          role: 'Operations Head',
          domain: 'Web Development',
          skills: ['React', 'Node.js', 'Express'],
          linkedIn: 'https://linkedin.com',
          github: 'https://github.com',
        },
        {
          name: 'Venkatesh P',
          position: 'Technical Lead',
          role: 'Core Team',
          domain: 'Full Stack',
          skills: ['MERN', 'Next.js', 'TypeScript'],
          linkedIn: 'https://linkedin.com',
          github: 'https://github.com',
        },
        {
          name: 'Harika K',
          position: 'Design Lead',
          role: 'Core Team',
          domain: 'UI/UX Design',
          skills: ['Figma', 'CSS', 'Tailwind'],
          linkedIn: 'https://linkedin.com',
          github: 'https://github.com',
        }
      ]
    });

    res.json({ success: true, message: 'Seeding successful! Added dummy teams and reset database collections.' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

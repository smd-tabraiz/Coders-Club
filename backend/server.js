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
    const allowedOrigins = [process.env.FRONTEND_URL];
    if (!origin || origin.startsWith('http://localhost:') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ─── NEW: ROLE-BASED ROUTERS ──────────────────────────────────────
const publicRoutes = require('./roles/public/public.routes');
const studentRoutes = require('./roles/student/student.routes');
const adminRoutes = require('./roles/admin/admin.routes');
const superadminRoutes = require('./roles/superadmin/superadmin.routes');

app.use('/api/public', publicRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superadminRoutes);

// ─── LEGACY FEATURE-BASED ROUTERS (Pending full migration) ────────
// We are keeping these intact for the features that haven't been split yet!
const authRoutes = require('./features/auth/auth.routes');
const eventRoutes = require('./features/event/event.routes');
const userRoutes = require('./features/user/user.routes');
const registrationRoutes = require('./features/registration/registration.routes');
const teamRoutes = require('./features/team/team.routes');
const galleryRoutes = require('./features/gallery/gallery.routes');
const certificateRoutes = require('./features/certificate/certificate.routes');
const notificationRoutes = require('./features/notification/notification.routes');
const contactRoutes = require('./features/contact/contact.routes');
const analyticsRoutes = require('./features/analytics/analytics.routes');
const activityRoutes = require('./features/activity/activity.routes');
const reviewRoutes = require('./features/review/review.routes');

app.use('/api/auth', authRoutes);
// Temporarily keeping legacy mounts so the frontend doesn't break for unmigrated parts
app.use('/api/events', eventRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Global Error Handler
app.use(errorHandler);

const http = require('http');
const server = http.createServer(app);
const socket = require('./socket');

// Initialize Socket.io
socket.init(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Common
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import GuestRoute from './components/common/GuestRoute';
import Spinner from './components/ui/Spinner';

// ── Pages: Public
import Landing from './roles/public/features/landing/pages/Landing';
import Login from './roles/public/features/auth/pages/Login';
import Register from './roles/public/features/auth/pages/Register';
import ForgotPassword from './roles/public/features/auth/pages/ForgotPassword';
import ResetPassword from './roles/public/features/auth/pages/ResetPassword';

// ── Pages: Shared (All authenticated roles)
import Home from './roles/shared/features/dashboard/pages/Home';
import Search from './roles/shared/features/dashboard/pages/Search';
import Profile from './roles/shared/features/users/pages/Profile';
import Gallery from './roles/shared/features/gallery/pages/Gallery';
import Contact from './roles/shared/features/contact/pages/Contact';
import Leaderboard from './roles/shared/features/leaderboard/pages/Leaderboard';
import Events from './roles/shared/features/events/pages/Events';
import EventDetail from './roles/shared/features/events/pages/EventDetail';
import Teams from './roles/shared/features/teams/pages/Teams';
import TeamBatch from './roles/shared/features/teams/pages/TeamBatch';
import Notifications from './roles/shared/features/notifications/pages/Notifications';
import Analytics from './roles/shared/features/analytics/pages/Analytics';

// ── Pages: Student
import MyRegistrations from './roles/student/features/registrations/pages/MyRegistrations';

// ── Pages: Admin
import CreateEvent from './roles/admin/features/events/pages/CreateEvent';
import AdminEvents from './roles/admin/features/events/pages/AdminEvents';
import AdminRegistrations from './roles/admin/features/registrations/pages/AdminRegistrations';
import AdminNotifications from './roles/admin/features/notifications/pages/AdminNotifications';
import AddAdmin from './roles/admin/features/users/pages/AddAdmin';
import SupportInbox from './roles/admin/features/contact/pages/SupportInbox';
import AdminReviews from './roles/admin/features/reviews/pages/AdminReviews';

// ── Pages: SuperAdmin
import UserManagement from './roles/superadmin/features/users/pages/UserManagement';
import SystemSettings from './roles/superadmin/features/settings/pages/SystemSettings';
import ActivityLogs from './roles/superadmin/features/activity/pages/ActivityLogs';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ── Public ─────────────────────────────────────────── */}
          <Route path="/" element={<Landing />} />

          {/* ── Guest-only auth pages ───────────────────────────── */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* ── Protected: Role-Based Routing ────────────────────── */}
          
          <Route element={<ProtectedRoute />}>
            
            {/* SuperAdmin Dashboard */}
            <Route element={<ProtectedRoute roles={['superadmin']} />}>
              <Route path="/superadmin" element={<DashboardLayout />}>
                <Route index element={<Home />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="add-admin" element={<AddAdmin />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="activity" element={<ActivityLogs />} />
                <Route path="profile" element={<Profile />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<Contact />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="events/:id" element={<EventDetail />} />
                <Route path="events/create" element={<CreateEvent />} />
                <Route path="events/:id/edit" element={<CreateEvent />} />
                <Route path="registrations" element={<AdminRegistrations />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="inbox" element={<SupportInbox />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="reviews" element={<AdminReviews />} />
              </Route>
            </Route>

            {/* Admin Dashboard */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<Home />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="add-admin" element={<AddAdmin />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<Contact />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="events/:id" element={<EventDetail />} />
                <Route path="events/create" element={<CreateEvent />} />
                <Route path="events/:id/edit" element={<CreateEvent />} />
                <Route path="registrations" element={<AdminRegistrations />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="inbox" element={<SupportInbox />} />
                <Route path="my-notifications" element={<Notifications />} />
                <Route path="teams" element={<Teams />} />
                <Route path="teams/:teamId/batch" element={<TeamBatch />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="reviews" element={<AdminReviews />} />
              </Route>
            </Route>

            {/* Member Dashboard (View only for events) */}
            <Route element={<ProtectedRoute roles={['member']} />}>
              <Route path="/member" element={<DashboardLayout />}>
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<Contact />} />
                <Route path="events" element={<Events />} />
                <Route path="events/:id" element={<EventDetail />} />
                <Route path="teams" element={<Teams />} />
                <Route path="teams/:teamId/batch" element={<TeamBatch />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="registrations" element={<AdminRegistrations />} />
              </Route>
            </Route>

            {/* Student/User Dashboard */}
            <Route element={<ProtectedRoute roles={['student']} />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="search" element={<Search />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<Contact />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="events" element={<Events />} />
                <Route path="events/:id" element={<EventDetail />} />
                <Route path="teams" element={<Teams />} />
                <Route path="teams/:teamId/batch" element={<TeamBatch />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="my-registrations" element={<MyRegistrations />} />
              </Route>
            </Route>

          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

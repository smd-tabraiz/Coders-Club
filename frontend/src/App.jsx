import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import GuestRoute from './components/common/GuestRoute';
import Spinner from './components/ui/Spinner';

// ── Pages: Public
import Landing from './pages/Landing';

// ── Pages: Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// ── Pages: Dashboard (all authenticated roles)
import Home from './pages/dashboard/Home';
import Events from './pages/dashboard/Events';
import EventDetail from './pages/dashboard/EventDetail';
import Teams from './pages/dashboard/Teams';
import TeamBatch from './pages/dashboard/TeamBatch';
import Gallery from './pages/dashboard/Gallery';
import Analytics from './pages/dashboard/Analytics';
import Notifications from './pages/dashboard/Notifications';
import Search from './pages/dashboard/Search';
import Profile from './pages/dashboard/Profile';
import Contact from './pages/dashboard/Contact';
import Leaderboard from './pages/dashboard/Leaderboard';

// ── Pages: Student-specific
import MyRegistrations from './pages/student/MyRegistrations';

// ── Pages: Admin + SuperAdmin (edit access)
import CreateEvent from './pages/dashboard/CreateEvent';
import AdminEvents from './pages/admin/AdminEvents';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import AdminNotifications from './pages/admin/AdminNotifications';
import AddAdmin from './pages/admin/AddAdmin';

// ── Pages: Club Member + Admin + SuperAdmin (view or manage)
// (AdminEvents and AdminRegistrations already handle read-only for members via canEdit)

// ── Pages: SuperAdmin only
import UserManagement from './pages/superadmin/UserManagement';
import SystemSettings from './pages/superadmin/SystemSettings';

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

          {/* ── Protected: All authenticated roles ─────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>

              {/* Common (all 4 roles) */}
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="search" element={<Search />} />

              {/* Student + all */}
              <Route path="notifications" element={<Notifications />} />
              <Route path="contact" element={<Contact />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="teams" element={<Teams />} />
              <Route path="teams/:teamId/batch" element={<TeamBatch />} />
              <Route path="analytics" element={<Analytics />} />

              {/* Student-only */}
              <Route element={<ProtectedRoute roles={['student']} />}>
                <Route path="my-registrations" element={<MyRegistrations />} />
              </Route>

              {/* Admin + SuperAdmin + Member — view-only for member */}
              <Route element={<ProtectedRoute roles={['admin', 'superadmin', 'member']} />}>
                <Route path="admin/events" element={<AdminEvents />} />
                <Route path="admin/registrations" element={<AdminRegistrations />} />
              </Route>

              {/* Admin + SuperAdmin — edit/manage */}
              <Route element={<ProtectedRoute roles={['admin', 'superadmin']} />}>
                <Route path="events/create" element={<CreateEvent />} />
                <Route path="events/:id/edit" element={<CreateEvent />} />
                <Route path="admin/add-admin" element={<AddAdmin />} />
                <Route path="admin/notifications" element={<AdminNotifications />} />
              </Route>

              {/* SuperAdmin only */}
              <Route element={<ProtectedRoute roles={['superadmin']} />}>
                <Route path="superadmin/users" element={<UserManagement />} />
              </Route>

              {/* SuperAdmin and Admin */}
              <Route element={<ProtectedRoute roles={['superadmin', 'admin']} />}>
                <Route path="superadmin/settings" element={<SystemSettings />} />
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

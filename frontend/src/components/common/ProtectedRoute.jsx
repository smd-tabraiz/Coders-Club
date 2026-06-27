import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

/**
 * ProtectedRoute
 * - With no `roles` prop: just checks authentication.
 * - With `roles` prop: additionally checks if the user's role is allowed.
 *   Unauthorized roles are redirected to /dashboard (not /login).
 */
const ProtectedRoute = ({ roles }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not authenticated → send to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role check — redirect unauthorized users to their own dashboard
  if (roles && !roles.includes(user.role)) {
    const dashPath = user.role === 'student' ? '/dashboard' : `/${user.role}`;
    return <Navigate to={dashPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

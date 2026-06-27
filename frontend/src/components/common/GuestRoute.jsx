import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

/**
 * GuestRoute — wraps auth pages (login, register, forgot-password).
 * If the user is already logged in, redirect them to the dashboard.
 * If loading, show a spinner.
 */
const GuestRoute = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  // Already authenticated → go to their respective dashboard
  if (token && user) {
    const dashPath = user.role === 'student' ? '/dashboard' : `/${user.role}`;
    return <Navigate to={dashPath} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;

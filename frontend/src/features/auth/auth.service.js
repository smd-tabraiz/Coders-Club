/**
 * auth.service.js
 * Handles all authentication API calls.
 * Called by: AuthContext.jsx
 */
import api from '../../api/axios';

// Register a new user account (defaults to 'student' role)
export const registerUser = (formData) =>
  api.post('/auth/register', formData);

// Login with email + password
export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password });

// Get the currently logged-in user (validates token)
export const getMe = () =>
  api.get('/auth/me');

// Send forgot-password email
export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email });

// Reset password using token from email
export const resetPassword = (token, password) =>
  api.post('/auth/reset-password', { token, password });

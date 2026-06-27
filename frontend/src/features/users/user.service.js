/**
 * user.service.js
 * Handles all user management API calls.
 * Called by: UserManagement.jsx, AddAdmin.jsx, Profile.jsx
 */
import api from '../../api/axios';

// Get all users (with optional filters)
// roles: superadmin, admin, member can access
export const getAllUsers = (params = {}) =>
  api.get('/users', { params });

// Get a single user by ID
export const getUserById = (id) =>
  api.get(`/users/${id}`);

// Update a user's profile
export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data);

// Delete a user (superadmin only)
export const deleteUser = (id) =>
  api.delete(`/users/${id}`);

// Change a user's role
// superadmin: can set any role (student/member/admin)
// admin: can only promote to admin
export const changeUserRole = (id, role) =>
  api.patch(`/users/${id}/role`, { role });

// Create a new admin account
// Access: superadmin + admin
export const addAdmin = (data) =>
  api.post('/users/add-admin', data);

// Create a new super admin account
// Access: superadmin only
export const addSuperAdmin = (data) =>
  api.post('/superadmin/users/add-superadmin', data);

// Toggle user active/inactive status (superadmin only)
export const toggleUserActive = (id) =>
  api.patch(`/users/${id}/toggle-active`);

// Search users by name, email, or roll number
export const searchUsers = (query) =>
  api.get('/users/search', { params: { q: query } });

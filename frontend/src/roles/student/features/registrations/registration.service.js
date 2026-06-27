/**
 * registration.service.js
 * Handles student event registration API calls.
 * Called by: AdminRegistrations.jsx, MyRegistrations.jsx, EventDetail.jsx
 */
import api from '../../../../api/axios';

// Get all registrations (admin/superadmin/member)
export const getAllRegistrations = (params = {}) =>
  api.get('/registrations', { params });

// Get registrations for a specific event (admin/superadmin)
export const getRegistrationsByEvent = (eventId) =>
  api.get('/registrations', { params: { event: eventId } });

// Get the logged-in student's own registrations
export const getMyRegistrations = () =>
  api.get('/registrations/my');

// Register for an event (student/member)
export const registerForEvent = (eventId, teamData = {}) =>
  api.post('/registrations', { event: eventId, ...teamData });

// Update registration status — approve or reject (admin/superadmin only)
export const updateRegistrationStatus = (id, status) =>
  api.patch(`/registrations/${id}/status`, { status });

// Cancel/delete a registration
export const cancelRegistration = (id) =>
  api.delete(`/registrations/${id}`);

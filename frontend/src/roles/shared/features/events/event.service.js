/**
 * event.service.js
 * Handles all event-related API calls.
 * Called by: Events.jsx, AdminEvents.jsx, CreateEvent.jsx, EventDetail.jsx
 */
import api from '../../../../api/axios';

// Get all events (public — no login needed)
export const getAllEvents = (params = {}) =>
  api.get('/events', { params });

// Get a single event by ID (public)
export const getEventById = (id) =>
  api.get(`/events/${id}`);

// Create a new event (admin/superadmin only)
// Accepts FormData for banner image upload
export const createEvent = (formData) =>
  api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Update an existing event (admin/superadmin only)
export const updateEvent = (id, formData) =>
  api.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Delete an event (admin/superadmin only)
export const deleteEvent = (id) =>
  api.delete(`/events/${id}`);

// Get analytics for a specific event (admin/superadmin only)
export const getEventAnalytics = (id) =>
  api.get(`/events/${id}/analytics`);

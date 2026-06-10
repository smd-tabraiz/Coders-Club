/**
 * notification.service.js
 * Handles notification API calls.
 * Called by: AdminNotifications.jsx, Notifications.jsx
 */
import api from './axios';

// Get all notifications for the logged-in user
export const getNotifications = () =>
  api.get('/notifications');

// Send a new notification (admin/superadmin only)
export const sendNotification = (data) =>
  api.post('/notifications', data);

// Mark a notification as read
export const markAsRead = (id) =>
  api.patch(`/notifications/${id}/read`);

// Delete a notification
export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}`);

/**
 * gallery.service.js
 * Handles gallery API calls.
 * Called by: Gallery.jsx
 */
export const getGallery = (params = {}) =>
  api.get('/gallery', { params });

export const uploadPhoto = (formData) =>
  api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deletePhoto = (id) =>
  api.delete(`/gallery/${id}`);

/**
 * team.service.js
 * Handles team/batch API calls.
 * Called by: Teams.jsx, TeamBatch.jsx
 */
export const getTeams = () =>
  api.get('/teams');

export const getTeamBatch = (batch) =>
  api.get(`/teams/${batch}`);

/**
 * analytics.service.js
 * Handles analytics API calls.
 * Called by: Analytics.jsx
 */
export const getAnalytics = () =>
  api.get('/analytics');

/**
 * contact.service.js
 * Handles contact form API calls.
 * Called by: Contact.jsx
 */
export const sendContactMessage = (data) =>
  api.post('/contact', data);

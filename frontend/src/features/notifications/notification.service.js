import api from '../../api/axios';

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

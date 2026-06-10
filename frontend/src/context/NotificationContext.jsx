import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      // Mock data
      const mockNotifications = [
        {
          _id: '1',
          message: 'Welcome to Coders Club GPREC! Complete your profile to earn your first badge.',
          type: 'general',
          read: false,
          createdAt: new Date(Date.now() - 3600000 * 2)
        },
        {
          _id: '2',
          message: 'New Event Alert: Code Sprint 2025 registration is now open.',
          type: 'event',
          read: false,
          createdAt: new Date(Date.now() - 3600000 * 24)
        },
        {
          _id: '3',
          message: 'Your registration for Web Dev Bootcamp was successful.',
          type: 'registration',
          read: true,
          createdAt: new Date(Date.now() - 3600000 * 48)
        }
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      // Mock update
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      fetchNotifications();
    } catch (err) {
      // Mock update
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

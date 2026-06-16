import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../api/auth.service';

const AuthContext = createContext();

/**
 * ROLE HIERARCHY (backend enforced):
 * - superadmin : First registered user. Role is locked permanently.
 * - admin      : Created by superadmin or admin via Add Admin.
 * - member     : Club member with view-only access to admin data.
 * - student    : Default role after registration. Personal dashboard only.
 */

export const AuthProvider = ({ children }) => {
  // Restore user + token from sessionStorage on page refresh
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('user');
      // ✅ CORRECT: We parse the string back into an object and return it
      return saved ? JSON.parse(saved) : null; 
    } catch { 
      return null; 
    }
  });

  // ✅ CORRECT: Token state is defined outside at the top level
  const [token, setToken] = useState(() => sessionStorage.getItem('token') || null);
  
  const [loading, setLoading] = useState(true);

  // ... (the rest of your code is completely correct!)

  // On app start: validate the saved token with the backend
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMe();
        const userData = res.data.data;
        setUser(userData);
         sessionStorage.setItem('user', JSON.stringify(userData)); 
      } catch {
        // Token expired or invalid → clear session
        _clearSession();
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, []); // Run only once on mount

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      const { token: newToken, data } = res.data;
      _saveSession(newToken, data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ── Register ──────────────────────────────────────────────────────────────
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await registerUser(formData);
      const { token: newToken, data } = res.data;
      _saveSession(newToken, data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    _clearSession();
  };

  // ── Update Profile ────────────────────────────────────────────────────────
  const refreshUser = async () => {
    try {
      const res = await getMe();
      const userData = res.data.data;
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch {
      // silently fail
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
 const _saveSession = (tok, userData) => {
  sessionStorage.setItem('token', tok); // was localStorage
  sessionStorage.setItem('user', JSON.stringify(userData)); // was localStorage
  setToken(tok);
  setUser(userData);
};

 const _clearSession = () => {
  sessionStorage.removeItem('token'); // was localStorage
  sessionStorage.removeItem('user'); // was localStorage
  setToken(null);
  setUser(null);
};

  // ── Permission Helpers ────────────────────────────────────────────────────
  // Components use these instead of checking role strings directly.
  const can = {
    editContent:    ['superadmin', 'admin'].includes(user?.role),
    deleteAdmin:    user?.role === 'superadmin',
    addAdmin:       ['superadmin', 'admin'].includes(user?.role),
    viewAdminPanel: ['superadmin', 'admin', 'member'].includes(user?.role),
    manageSystem:   user?.role === 'superadmin',
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

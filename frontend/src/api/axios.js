import axios from 'axios';

let rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Automatically append /api if the user forgot it in their environment variables!
if (!rawApiUrl.endsWith('/api')) {
  // If they accidentally added a trailing slash before /api, handle that too
  if (rawApiUrl.endsWith('/')) {
    rawApiUrl = rawApiUrl + 'api';
  } else {
    rawApiUrl = rawApiUrl + '/api';
  }
}

const api = axios.create({
  baseURL: rawApiUrl,
  withCredentials: true,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle session timeout (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('token');
      // Redirect to login only if not already on public routes
      const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

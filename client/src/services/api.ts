import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token from localStorage as fallback for cross-domain deployments
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shreeji_admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to catch 401s and clean up expired admin sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('shreeji_admin_token');
      localStorage.removeItem('shreeji_admin_user');
      // Redirect to login if on protected route
      window.location.href = '/admin/login?expired=true';
    }
    return Promise.reject(error);
  }
);

export default api;

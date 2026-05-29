import axios from "axios";
import { navigateB } from "../utils/navigation";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Attaches JWT token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
// Unwraps res.data so result is already { success, data, message }
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const status = err.response?.status;
    const msg = err.response?.data?.message || 'Network error';

    if (status === 401) {
      // Token expired or invalid
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigateB('/login', { replace: true });
      return Promise.reject({ success: false, message: 'Session expired' });
    }

    if (status === 403) {
      // Insufficient role/branch access
      return Promise.reject({ success: false, message: msg });
    }

    return Promise.reject(err.response?.data || { success: false, message: 'Unknown error' });
  }
);

export default api;
import axios from "axios";
import { navigateB } from "../utils/navigation";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});
let isRedirecting = false;  // ← flag outside the interceptor

// ── Request interceptor ───────────────────────────────────────────────────────
// Attaches JWT token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add timestamp to GET requests to prevent 304 caching
    if (config.method === 'get') {
        config.params = {
            ...config.params,
            _t: Date.now()   // ← forces a fresh request every time
        };
    }
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
// Unwraps res.data so result is already { success, data, message }
api.interceptors.response.use(
  (res) => {
    // ✅ Safely unwrap & ensure consistent shape
    const data = res.data;
    if (!data || typeof data !== 'object') {
      return { success: true, data: null, message: 'Operation successful' };
    }
    return data;
  },
  (err) => {
    const status = err.response?.status;
    const msg = err.response?.data?.message || 'Network error';
    const isLoginRequest = err.config?.url?.includes('/auth/login');

    if (status === 401 && !isLoginRequest) {
      // Token expired or invalid
             if (!isRedirecting) {
                isRedirecting = true;
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigateB('/login', { replace: true });

                // Reset flag after navigation settles
                setTimeout(() => { isRedirecting = false; }, 3000);
            }
      return Promise.reject({ success: false, message: msg });
    }

    if (status === 403) {
      // Insufficient role/branch access
      return Promise.reject({ success: false, message: msg });
    }

    return Promise.reject(err.response?.data || { success: false, message: 'Unknown error' });
  }
);


export default api;
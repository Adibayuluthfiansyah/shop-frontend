import axios from 'axios';
import { useCsrfStore } from '@/app/store/useCsrfStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add a request interceptor to include token 
api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  if (typeof window !== 'undefined') {
    // csrf token will be handled zustand without hooks 
    const csrfToken = useCsrfStore.getState().csrfToken;
    const method = config.method?.toUpperCase() || 'GET';

    if (csrfToken && method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
}
);

// add a response interceptor to handle errors globally
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    if (!window.location.pathname.includes('/login'))
    window.location.href = '/login';
  }
  return Promise.reject(error);
})

export default api;
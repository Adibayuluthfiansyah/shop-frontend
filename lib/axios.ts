import axios from 'axios';
import Router from 'next/router';
import { useCsrfStore } from '@/app/store/useCsrfStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add a request interceptor to include token in headers
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // csrf token will be handled zustand without hooks 
    const csrfToken = useCsrfStore.getState().csrfToken;

    //check method just add if danger method/mutation
    const method = config.method?.toUpperCase();
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
    localStorage.removeItem('token');
    Router.push('/login');
  }
  return Promise.reject(error);
})

export default api;
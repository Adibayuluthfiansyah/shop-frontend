import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// add a request interceptor to include token 
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken){
      config.headers['Authorization'] = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor to handle errors
api.interceptors.response.use(
  (response) => response ,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Error 401:", error);
      await signOut({callbackUrl: "/login"});
    }
    return Promise.reject(error);
  }
);

export default api;
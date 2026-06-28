import axios from 'axios';
import { API_BASE } from '../utils/constants';

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach JWT
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — global error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    } else if (!error.response) {
      // Network error — will be caught by individual components
      error.isNetworkError = true;
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

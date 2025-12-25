import axios from 'axios';
import { message } from 'antd';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      
      switch (status) {
        case 401:
          message.error('Unauthorized. Please login again.');
          localStorage.removeItem('user');
          window.location.href = '/';
          break;
        case 403:
          message.error('Access forbidden.');
          break;
        case 404:
          message.error('Resource not found.');
          break;
        case 500:
          message.error('Server error. Please try again later.');
          break;
        default:
          message.error(`Error: ${error.response.data?.message || 'Something went wrong'}`);
      }
    } else if (error.request) {
      // Request made but no response
      message.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      message.error('An unexpected error occurred.');
    }
    
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
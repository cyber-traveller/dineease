import axios from 'axios';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Public routes that don't require authentication
const publicRoutes = [
  '/restaurants',
  '/restaurants/',
  '/reviews',
  '/reviews/',
  '/restaurants?',
  '/restaurants/?',
  '/reviews?',
  '/reviews/?',
  '/auth/login',
  '/auth/register',
  '/payments/create-order',
  '/payments/verify'
];

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Always add the token if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject({
        response: {
          status: 'ERR_NETWORK',
          data: { message: 'Network error. Please check if the server is running.' }
        }
      });
    }

    // Handle specific error status codes
    switch (error.response.status) {
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 404:
        console.error('Resource not found:', error.config.url);
        break;
      case 500:
        console.error('Server error:', error.response.data);
        break;
      default:
        console.error('API error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default instance;
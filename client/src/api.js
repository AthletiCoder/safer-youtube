import axios from 'axios';

// Create a pre-configured axios instance
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',  // Adjust if needed
});

// Authentication API Calls
export const login = (credentials) => instance.post('/auth/login', credentials);
export const register = (userData) => instance.post('/auth/register', userData);

// Intercept requests to include token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Export axios instance for general use
export default instance;

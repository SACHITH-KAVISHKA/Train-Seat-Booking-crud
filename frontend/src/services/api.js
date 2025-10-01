import axios from 'axios';
import { STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';

// Use proxy path in development, full URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Use Vite proxy in development
  : import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if you need to send cookies
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (!response) {
      // Network error
      console.error('Network error:', error);
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        status: 0,
      });
    }
    
    const { status, data } = response;
    
    switch (status) {
      case 401:
        // Unauthorized - clear auth data and redirect to login
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject({
          message: ERROR_MESSAGES.UNAUTHORIZED,
          status,
          data,
        });
        
      case 403:
        return Promise.reject({
          message: ERROR_MESSAGES.FORBIDDEN,
          status,
          data,
        });
        
      case 404:
        return Promise.reject({
          message: ERROR_MESSAGES.NOT_FOUND,
          status,
          data,
        });
        
      case 422:
        return Promise.reject({
          message: data?.message || ERROR_MESSAGES.VALIDATION_ERROR,
          status,
          data,
          errors: data?.errors,
        });
        
      case 500:
      default:
        return Promise.reject({
          message: data?.message || ERROR_MESSAGES.SERVER_ERROR,
          status,
          data,
        });
    }
  }
);

// API utility functions
export const apiUtils = {
  /**
   * Handle API response and extract data
   * @param {Promise} apiCall - API call promise
   * @returns {Promise} API response data
   */
  handleResponse: async (apiCall) => {
    try {
      const response = await apiCall;
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Build query string from parameters
   * @param {object} params - Query parameters
   * @returns {string} Query string
   */
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, item));
        } else {
          searchParams.append(key, value);
        }
      }
    });
    
    return searchParams.toString();
  },
  
  /**
   * Create FormData from object
   * @param {object} data - Data object
   * @returns {FormData} FormData instance
   */
  createFormData: (data) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    
    return formData;
  },
  
  /**
   * Download file from response
   * @param {object} response - API response
   * @param {string} filename - File name
   */
  downloadFile: (response, filename) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

// Export api instance as default
export default api;
// API endpoints
export const API_ENDPOINTS = {
  // Train endpoints
  TRAINS: '/trains',
  TRAIN_BY_ID: (id) => `/trains/${id}`,
  
  // Schedule endpoints
  SCHEDULES: '/schedules',
  SCHEDULE_BY_ID: (id) => `/schedules/${id}`,
  SEARCH_SCHEDULES: '/bookings/search', // Based on backend controller
  GET_STATIONS: '/bookings/stations', // New endpoint for station names
  
  // Booking endpoints
  BOOKINGS: '/bookings',
  ALL_BOOKINGS: '/bookings/all',
  BOOKING_BY_ID: (id) => `/bookings/${id}`,
  BOOKING_BY_PNR: (pnr) => `/bookings/pnr/${pnr}`,
  CANCEL_BOOKING: (id) => `/bookings/${id}/cancel`,
  UPDATE_BOOKING: (id) => `/bookings/${id}`,
  CREATE_BOOKING: '/bookings/book',
  
  // Health check
  HEALTH: '/health',
};

// Application constants
export const APP_CONFIG = {
  APP_NAME: 'Train Booking System',
  APP_VERSION: '1.0.0',
  API_TIMEOUT: 30000,
  PAGE_SIZE: 10,
  MAX_PASSENGERS: 6,
  MIN_BOOKING_DAYS: 1,
  MAX_BOOKING_DAYS: 120,
};

// Local storage keys
export const STORAGE_KEYS = {
  SEARCH_PREFERENCES: 'searchPreferences',
  THEME_PREFERENCE: 'themePreference',
  LANGUAGE_PREFERENCE: 'languagePreference',
};

// Booking status constants
export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  REFUNDED: 'REFUNDED',
};

// Train types
export const TRAIN_TYPES = {
  EXPRESS: 'EXPRESS',
  SUPER_FAST: 'SUPER_FAST',
  INTERCITY: 'INTERCITY',
  LOCAL: 'LOCAL',
  MAIL: 'MAIL',
};

// Seat classes
export const SEAT_CLASSES = {
  FIRST_AC: '1A',
  SECOND_AC: '2A',
  THIRD_AC: '3A',
  SLEEPER: 'SL',
  GENERAL: 'GN',
};

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

// Form validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PNR: /^[A-Z0-9]{10}$/,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Requested resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  BOOKING_FAILED: 'Booking failed. Please try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  BOOKING_SUCCESS: 'Booking confirmed successfully!',
  BOOKING_CANCELLED: 'Booking cancelled successfully!',
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd\'T\'HH:mm:ss',
};

// Responsive breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
};

// Animation durations
export const ANIMATION_DURATION = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500,
};

// Toast configuration
export const TOAST_CONFIG = {
  duration: 4000,
  position: 'top-center',
  style: {
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif',
  },
};

// Pagination configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_SIZE: 10,
  SIZE_OPTIONS: [5, 10, 20, 50],
};

// File upload configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  MAX_FILES: 5,
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Sort options
export const SORT_OPTIONS = {
  PRICE_LOW_HIGH: 'price_asc',
  PRICE_HIGH_LOW: 'price_desc',
  DURATION_SHORT_LONG: 'duration_asc',
  DURATION_LONG_SHORT: 'duration_desc',
  DEPARTURE_EARLY_LATE: 'departure_asc',
  DEPARTURE_LATE_EARLY: 'departure_desc',
  ARRIVAL_EARLY_LATE: 'arrival_asc',
  ARRIVAL_LATE_EARLY: 'arrival_desc',
};

// Filter options
export const FILTER_OPTIONS = {
  TRAIN_TYPES: Object.values(TRAIN_TYPES),
  SEAT_CLASSES: Object.values(SEAT_CLASSES),
  PRICE_RANGES: [
    { label: 'Under Rs.500', min: 0, max: 500 },
    { label: 'Rs.500 - Rs.1000', min: 500, max: 1000 },
    { label: 'Rs.1000 - Rs.2000', min: 1000, max: 2000 },
    { label: 'Above Rs.2000', min: 2000, max: 999999 },
  ],
  TIME_RANGES: [
    { label: 'Early Morning (00:00 - 06:00)', start: '00:00', end: '06:00' },
    { label: 'Morning (06:00 - 12:00)', start: '06:00', end: '12:00' },
    { label: 'Afternoon (12:00 - 18:00)', start: '12:00', end: '18:00' },
    { label: 'Evening (18:00 - 24:00)', start: '18:00', end: '24:00' },
  ],
};
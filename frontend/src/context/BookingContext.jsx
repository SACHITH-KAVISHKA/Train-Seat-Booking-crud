import React, { createContext, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { bookingService } from '../services/bookingService';
import { BOOKING_STATUS } from '../utils/constants';

// Initial state
const initialState = {
  // Search
  searchResults: [],
  searchLoading: false,
  searchError: null,
  searchFilters: {
    from: '',
    to: '',
    departureDate: '',
    trainType: '',
    seatClass: '',
    sortBy: 'departure_asc',
  },
  
  // Selected train/schedule
  selectedSchedule: null,
  availableSeats: {},
  seatsLoading: false,
  
  // Booking process
  bookingData: {
    passengers: [],
    seatClass: '',
    seatCount: 1,
    contactInfo: {},
  },
  bookingStep: 0,
  bookingLoading: false,
  bookingError: null,
  
  // Current booking
  currentBooking: null,
  
  // User bookings
  userBookings: [],
  bookingsLoading: false,
  bookingsError: null,
  bookingsPagination: {
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0,
  },
  
  // Booking details
  bookingDetails: null,
  detailsLoading: false,
  
  // Stations and routes
  stations: [],
  popularRoutes: [],
};

// Action types
const BOOKING_ACTIONS = {
  // Search actions
  SET_SEARCH_LOADING: 'SET_SEARCH_LOADING',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCH_ERROR: 'SET_SEARCH_ERROR',
  SET_SEARCH_FILTERS: 'SET_SEARCH_FILTERS',
  CLEAR_SEARCH_RESULTS: 'CLEAR_SEARCH_RESULTS',
  
  // Schedule actions
  SET_SELECTED_SCHEDULE: 'SET_SELECTED_SCHEDULE',
  SET_AVAILABLE_SEATS: 'SET_AVAILABLE_SEATS',
  SET_SEATS_LOADING: 'SET_SEATS_LOADING',
  
  // Booking process actions
  SET_BOOKING_DATA: 'SET_BOOKING_DATA',
  SET_BOOKING_STEP: 'SET_BOOKING_STEP',
  SET_BOOKING_LOADING: 'SET_BOOKING_LOADING',
  SET_BOOKING_ERROR: 'SET_BOOKING_ERROR',
  SET_CURRENT_BOOKING: 'SET_CURRENT_BOOKING',
  RESET_BOOKING_PROCESS: 'RESET_BOOKING_PROCESS',
  
  // User bookings actions
  SET_BOOKINGS_LOADING: 'SET_BOOKINGS_LOADING',
  SET_USER_BOOKINGS: 'SET_USER_BOOKINGS',
  SET_BOOKINGS_ERROR: 'SET_BOOKINGS_ERROR',
  SET_BOOKINGS_PAGINATION: 'SET_BOOKINGS_PAGINATION',
  UPDATE_BOOKING_IN_LIST: 'UPDATE_BOOKING_IN_LIST',
  REMOVE_BOOKING_FROM_LIST: 'REMOVE_BOOKING_FROM_LIST',
  
  // Booking details actions
  SET_BOOKING_DETAILS: 'SET_BOOKING_DETAILS',
  SET_DETAILS_LOADING: 'SET_DETAILS_LOADING',
  
  // Stations and routes
  SET_STATIONS: 'SET_STATIONS',
  SET_POPULAR_ROUTES: 'SET_POPULAR_ROUTES',
  
  // Clear errors
  CLEAR_ERRORS: 'CLEAR_ERRORS',
};

// Reducer function
const bookingReducer = (state, action) => {
  switch (action.type) {
    // Search actions
    case BOOKING_ACTIONS.SET_SEARCH_LOADING:
      return { ...state, searchLoading: action.payload, searchError: null };
      
    case BOOKING_ACTIONS.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload, searchLoading: false, searchError: null };
      
    case BOOKING_ACTIONS.SET_SEARCH_ERROR:
      return { ...state, searchError: action.payload, searchLoading: false };
      
    case BOOKING_ACTIONS.SET_SEARCH_FILTERS:
      return { ...state, searchFilters: { ...state.searchFilters, ...action.payload } };
      
    case BOOKING_ACTIONS.CLEAR_SEARCH_RESULTS:
      return { ...state, searchResults: [], searchError: null };
      
    // Schedule actions
    case BOOKING_ACTIONS.SET_SELECTED_SCHEDULE:
      return { ...state, selectedSchedule: action.payload };
      
    case BOOKING_ACTIONS.SET_AVAILABLE_SEATS:
      return { ...state, availableSeats: action.payload, seatsLoading: false };
      
    case BOOKING_ACTIONS.SET_SEATS_LOADING:
      return { ...state, seatsLoading: action.payload };
      
    // Booking process actions
    case BOOKING_ACTIONS.SET_BOOKING_DATA:
      return { ...state, bookingData: { ...state.bookingData, ...action.payload } };
      
    case BOOKING_ACTIONS.SET_BOOKING_STEP:
      return { ...state, bookingStep: action.payload };
      
    case BOOKING_ACTIONS.SET_BOOKING_LOADING:
      return { ...state, bookingLoading: action.payload, bookingError: null };
      
    case BOOKING_ACTIONS.SET_BOOKING_ERROR:
      return { ...state, bookingError: action.payload, bookingLoading: false };
      
    case BOOKING_ACTIONS.SET_CURRENT_BOOKING:
      return { ...state, currentBooking: action.payload, bookingLoading: false };
      
    case BOOKING_ACTIONS.RESET_BOOKING_PROCESS:
      return {
        ...state,
        bookingData: initialState.bookingData,
        bookingStep: 0,
        bookingLoading: false,
        bookingError: null,
        currentBooking: null,
        selectedSchedule: null,
        availableSeats: {},
      };
      
    // User bookings actions
    case BOOKING_ACTIONS.SET_BOOKINGS_LOADING:
      return { ...state, bookingsLoading: action.payload, bookingsError: null };
      
    case BOOKING_ACTIONS.SET_USER_BOOKINGS:
      return { ...state, userBookings: action.payload, bookingsLoading: false, bookingsError: null };
      
    case BOOKING_ACTIONS.SET_BOOKINGS_ERROR:
      return { ...state, bookingsError: action.payload, bookingsLoading: false };
      
    case BOOKING_ACTIONS.SET_BOOKINGS_PAGINATION:
      return { ...state, bookingsPagination: { ...state.bookingsPagination, ...action.payload } };
      
    case BOOKING_ACTIONS.UPDATE_BOOKING_IN_LIST:
      return {
        ...state,
        userBookings: state.userBookings.map(booking =>
          booking.id === action.payload.id ? { ...booking, ...action.payload } : booking
        ),
      };
      
    case BOOKING_ACTIONS.REMOVE_BOOKING_FROM_LIST:
      return {
        ...state,
        userBookings: state.userBookings.filter(booking => booking.id !== action.payload),
      };
      
    // Booking details actions
    case BOOKING_ACTIONS.SET_BOOKING_DETAILS:
      return { ...state, bookingDetails: action.payload, detailsLoading: false };
      
    case BOOKING_ACTIONS.SET_DETAILS_LOADING:
      return { ...state, detailsLoading: action.payload };
      
    // Stations and routes
    case BOOKING_ACTIONS.SET_STATIONS:
      return { ...state, stations: action.payload };
      
    case BOOKING_ACTIONS.SET_POPULAR_ROUTES:
      return { ...state, popularRoutes: action.payload };
      
    // Clear errors
    case BOOKING_ACTIONS.CLEAR_ERRORS:
      return { ...state, searchError: null, bookingError: null, bookingsError: null };
      
    default:
      return state;
  }
};

// Create context
export const BookingContext = createContext();

// BookingProvider component
export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Search trains
  const searchTrains = useCallback(async (searchData) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_SEARCH_LOADING, payload: true });
      
      const results = await bookingService.searchTrains(searchData);
      
      dispatch({ type: BOOKING_ACTIONS.SET_SEARCH_RESULTS, payload: results });
      dispatch({ type: BOOKING_ACTIONS.SET_SEARCH_FILTERS, payload: searchData });
      
      return results;
    } catch (error) {
      dispatch({ type: BOOKING_ACTIONS.SET_SEARCH_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Set search filters
  const setSearchFilters = useCallback((filters) => {
    dispatch({ type: BOOKING_ACTIONS.SET_SEARCH_FILTERS, payload: filters });
  }, []);

  // Clear search results
  const clearSearchResults = useCallback(() => {
    dispatch({ type: BOOKING_ACTIONS.CLEAR_SEARCH_RESULTS });
  }, []);

  // Select schedule
  const selectSchedule = useCallback(async (schedule) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_SELECTED_SCHEDULE, payload: schedule });
      
      // Get schedule details if needed
      if (!schedule.detailedInfo) {
        const details = await bookingService.getScheduleDetails(schedule.id);
        dispatch({ type: BOOKING_ACTIONS.SET_SELECTED_SCHEDULE, payload: details });
      }
    } catch (error) {
      console.error('Error selecting schedule:', error);
    }
  }, []);

  // Get available seats
  const getAvailableSeats = useCallback(async (scheduleId, seatClass) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_SEATS_LOADING, payload: true });
      
      const seats = await bookingService.getAvailableSeats(scheduleId, seatClass);
      
      dispatch({ type: BOOKING_ACTIONS.SET_AVAILABLE_SEATS, payload: seats });
      return seats;
    } catch (error) {
      console.error('Error fetching available seats:', error);
      dispatch({ type: BOOKING_ACTIONS.SET_SEATS_LOADING, payload: false });
      throw error;
    }
  }, []);

  // Update booking data
  const updateBookingData = useCallback((data) => {
    dispatch({ type: BOOKING_ACTIONS.SET_BOOKING_DATA, payload: data });
  }, []);

  // Set booking step
  const setBookingStep = useCallback((step) => {
    dispatch({ type: BOOKING_ACTIONS.SET_BOOKING_STEP, payload: step });
  }, []);

  // Create booking
  const createBooking = useCallback(async (bookingData) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_BOOKING_LOADING, payload: true });
      
      const booking = await bookingService.createBooking(bookingData);
      
      dispatch({ type: BOOKING_ACTIONS.SET_CURRENT_BOOKING, payload: booking });
      return booking;
    } catch (error) {
      dispatch({ type: BOOKING_ACTIONS.SET_BOOKING_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Get user bookings
  const getUserBookings = useCallback(async (userId, filters = {}) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_BOOKINGS_LOADING, payload: true });
      
      const response = await bookingService.getUserBookings(userId, filters);
      
      dispatch({ type: BOOKING_ACTIONS.SET_USER_BOOKINGS, payload: response.bookings || response });
      
      if (response.pagination) {
        dispatch({ type: BOOKING_ACTIONS.SET_BOOKINGS_PAGINATION, payload: response.pagination });
      }
      
      return response;
    } catch (error) {
      dispatch({ type: BOOKING_ACTIONS.SET_BOOKINGS_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Get booking details
  const getBookingDetails = useCallback(async (bookingId) => {
    try {
      dispatch({ type: BOOKING_ACTIONS.SET_DETAILS_LOADING, payload: true });
      
      const booking = await bookingService.getBookingDetails(bookingId);
      
      dispatch({ type: BOOKING_ACTIONS.SET_BOOKING_DETAILS, payload: booking });
      return booking;
    } catch (error) {
      dispatch({ type: BOOKING_ACTIONS.SET_DETAILS_LOADING, payload: false });
      throw error;
    }
  }, []);

  // Update booking
  const updateBooking = useCallback(async (bookingId, updateData) => {
    try {
      const updatedBooking = await bookingService.updateBooking(bookingId, updateData);
      
      // Update in list if present
      dispatch({ type: BOOKING_ACTIONS.UPDATE_BOOKING_IN_LIST, payload: updatedBooking });
      
      // Update details if currently viewing
      if (state.bookingDetails?.id === bookingId) {
        dispatch({ type: BOOKING_ACTIONS.SET_BOOKING_DETAILS, payload: updatedBooking });
      }
      
      return updatedBooking;
    } catch (error) {
      throw error;
    }
  }, [state.bookingDetails]);

  // Cancel booking
  const cancelBooking = useCallback(async (bookingId, reason) => {
    try {
      const result = await bookingService.cancelBooking(bookingId, reason);
      
      // Update booking status in list
      dispatch({
        type: BOOKING_ACTIONS.UPDATE_BOOKING_IN_LIST,
        payload: { id: bookingId, status: BOOKING_STATUS.CANCELLED }
      });
      
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  // Get booking by PNR
  const getBookingByPNR = useCallback(async (pnrNumber) => {
    try {
      const booking = await bookingService.getBookingByPNR(pnrNumber);
      return booking;
    } catch (error) {
      throw error;
    }
  }, []);

  // Download ticket
  const downloadTicket = useCallback(async (bookingId, format) => {
    try {
      return await bookingService.downloadTicket(bookingId, format);
    } catch (error) {
      throw error;
    }
  }, []);

  // Get stations
  const getStations = useCallback(async () => {
    try {
      const stations = await bookingService.getAllStations();
      dispatch({ type: BOOKING_ACTIONS.SET_STATIONS, payload: stations });
      return stations;
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error;
    }
  }, []);

  // Get popular routes
  const getPopularRoutes = useCallback(async () => {
    try {
      const routes = await bookingService.getPopularRoutes();
      dispatch({ type: BOOKING_ACTIONS.SET_POPULAR_ROUTES, payload: routes });
      return routes;
    } catch (error) {
      console.error('Error fetching popular routes:', error);
      throw error;
    }
  }, []);

  // Reset booking process
  const resetBookingProcess = useCallback(() => {
    dispatch({ type: BOOKING_ACTIONS.RESET_BOOKING_PROCESS });
  }, []);

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch({ type: BOOKING_ACTIONS.CLEAR_ERRORS });
  }, []);

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    searchTrains,
    setSearchFilters,
    clearSearchResults,
    selectSchedule,
    getAvailableSeats,
    updateBookingData,
    setBookingStep,
    createBooking,
    getUserBookings,
    getBookingDetails,
    updateBooking,
    cancelBooking,
    getBookingByPNR,
    downloadTicket,
    getStations,
    getPopularRoutes,
    resetBookingProcess,
    clearErrors,
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

BookingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
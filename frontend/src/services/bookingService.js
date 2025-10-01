import api, { apiUtils } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const bookingService = {
  /**
   * Get all available station names
   * @returns {Promise<Array>} Array of unique station names
   */
  getAllStations: async () => {
    try {
      console.log('BookingService: Fetching all station names');
      const response = await api.get(API_ENDPOINTS.GET_STATIONS);
      console.log('BookingService: Stations response:', response.data);
      // Return the actual data array from the ApiResponseDTO wrapper
      return response.data.data || [];
    } catch (error) {
      console.error('BookingService: Error fetching stations:', error);
      throw error;
    }
  },

  /**
   * Search trains/schedules
   * @param {object} searchData - Search parameters
   * @param {string} searchData.departureStation - Departure station
   * @param {string} searchData.arrivalStation - Arrival station
   * @param {string} searchData.departureDate - Departure date (yyyy-MM-dd)
   * @param {number} searchData.seatCount - Number of seats required
   * @returns {Promise<Array>} Array of available schedules
   */
  searchTrains: async (searchData) => {
    try {
      console.log('BookingService: Making POST request to search trains with data:', searchData);
      const response = await api.post(API_ENDPOINTS.SEARCH_SCHEDULES, searchData);
      console.log('BookingService: Full API response:', response);
      console.log('BookingService: Response.data:', response.data);
      console.log('BookingService: Response.data.data:', response.data.data);
      // Return the actual data array from the ApiResponseDTO wrapper
      return response.data.data || [];
    } catch (error) {
      console.error('BookingService: Search error:', error);
      throw error;
    }
  },
  
  /**
   * Get schedule details by ID
   * @param {number} scheduleId - Schedule ID
   * @returns {Promise<object>} Schedule details
   */
  getScheduleDetails: async (scheduleId) => {
    try {
      const response = await api.get(API_ENDPOINTS.SCHEDULE_BY_ID(scheduleId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Create a new booking
   * @param {object} bookingData - Booking information
   * @param {number} bookingData.scheduleId - Schedule ID
   * @param {string} bookingData.passengerName - Passenger name
   * @param {string} bookingData.passengerEmail - Passenger email
   * @param {string} bookingData.passengerPhone - Passenger phone
   * @param {number} bookingData.seatCount - Number of seats
   * @returns {Promise<object>} Created booking details
   */
  createBooking: async (bookingData) => {
    try {
      console.log('BookingService: Creating booking with data:', bookingData);
      console.log('BookingService: Data types:', {
        scheduleId: typeof bookingData.scheduleId,
        passengerName: typeof bookingData.passengerName,
        passengerEmail: typeof bookingData.passengerEmail,
        passengerPhone: typeof bookingData.passengerPhone,
        seatCount: typeof bookingData.seatCount,
      });
      
      // Ensure scheduleId is a number and seatCount is an integer
      const sanitizedData = {
        ...bookingData,
        scheduleId: Number(bookingData.scheduleId),
        seatCount: parseInt(bookingData.seatCount, 10)
      };
      
      console.log('BookingService: Sanitized data:', sanitizedData);
      
      const response = await api.post(API_ENDPOINTS.CREATE_BOOKING, sanitizedData);
      console.log('BookingService: Booking created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('BookingService: Error creating booking:', error);
      console.error('BookingService: Error response:', error.response?.data);
      console.error('BookingService: Error status:', error.response?.status);
      throw error;
    }
  },
  
  /**
   * Get booking details by ID
   * @param {number} bookingId - Booking ID
   * @returns {Promise<object>} Booking details
   */
  getBookingDetails: async (bookingId) => {
    try {
      const response = await api.get(API_ENDPOINTS.BOOKING_BY_ID(bookingId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Update booking details
   * @param {number} bookingId - Booking ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} Updated booking details
   */
  updateBooking: async (bookingId, updateData) => {
    try {
      console.log('BookingService: Updating booking:', bookingId, updateData);
      const response = await api.put(API_ENDPOINTS.UPDATE_BOOKING(bookingId), updateData);
      console.log('BookingService: Booking updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('BookingService: Error updating booking:', error);
      throw error;
    }
  },
  
  /**
   * Cancel booking
   * @param {number} bookingId - Booking ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<object>} Cancellation confirmation
   */
  cancelBooking: async (bookingId, reason = '') => {
    try {
      console.log('BookingService: Cancelling booking:', bookingId);
      const response = await api.patch(API_ENDPOINTS.CANCEL_BOOKING(bookingId), {});
      console.log('BookingService: Booking cancelled successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('BookingService: Error cancelling booking:', error);
      throw error;
    }
  },
  
  /**
   * Get booking by PNR number
   * @param {string} pnrNumber - PNR number
   * @returns {Promise<object>} Booking details
   */
  getBookingByPNR: async (pnrNumber) => {
    try {
      const response = await api.get(API_ENDPOINTS.BOOKING_BY_PNR(pnrNumber));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all bookings
   * @returns {Promise<Array>} Array of all bookings
   */
  getAllBookings: async () => {
    try {
      console.log('BookingService: Fetching all bookings');
      const response = await api.get(API_ENDPOINTS.ALL_BOOKINGS);
      console.log('BookingService: All bookings response:', response.data);
      // Return the actual data array from the ApiResponseDTO wrapper
      return response.data.data || [];
    } catch (error) {
      console.error('BookingService: Error fetching all bookings:', error);
      throw error;
    }
  },
  
  /**
   * Download booking ticket
   * @param {number} bookingId - Booking ID
   * @param {string} format - Download format (pdf, jpg)
   * @returns {Promise<Blob>} Ticket file
   */
  downloadTicket: async (bookingId, format = 'pdf') => {
    try {
      const response = await api.get(`${API_ENDPOINTS.BOOKING_BY_ID(bookingId)}/ticket`, {
        params: { format },
        responseType: 'blob'
      });
      
      // Generate filename
      const filename = `ticket-${bookingId}.${format}`;
      apiUtils.downloadFile(response, filename);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get available seats for a schedule
   * @param {number} scheduleId - Schedule ID
   * @param {string} seatClass - Seat class
   * @returns {Promise<object>} Available seats information
   */
  getAvailableSeats: async (scheduleId, seatClass) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.SCHEDULE_BY_ID(scheduleId)}/seats`, {
        params: { seatClass }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Lock seats temporarily during booking process
   * @param {number} scheduleId - Schedule ID
   * @param {Array} seatNumbers - Seat numbers to lock
   * @param {string} seatClass - Seat class
   * @returns {Promise<object>} Lock confirmation
   */
  lockSeats: async (scheduleId, seatNumbers, seatClass) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.SCHEDULE_BY_ID(scheduleId)}/seats/lock`, {
        seatNumbers,
        seatClass
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Release locked seats
   * @param {number} scheduleId - Schedule ID
   * @param {Array} seatNumbers - Seat numbers to release
   * @param {string} seatClass - Seat class
   * @returns {Promise<object>} Release confirmation
   */
  releaseSeats: async (scheduleId, seatNumbers, seatClass) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.SCHEDULE_BY_ID(scheduleId)}/seats/release`, {
        seatNumbers,
        seatClass
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Process payment for booking
   * @param {object} paymentData - Payment information
   * @param {number} paymentData.bookingId - Booking ID
   * @param {string} paymentData.paymentMethod - Payment method
   * @param {number} paymentData.amount - Payment amount
   * @param {object} paymentData.paymentDetails - Payment details (card info, etc.)
   * @returns {Promise<object>} Payment confirmation
   */
  processPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments/process', paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get payment status
   * @param {string} paymentId - Payment ID
   * @returns {Promise<object>} Payment status
   */
  getPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}/status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Request refund for cancelled booking
   * @param {number} bookingId - Booking ID
   * @param {object} refundData - Refund details
   * @returns {Promise<object>} Refund confirmation
   */
  requestRefund: async (bookingId, refundData) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.BOOKING_BY_ID(bookingId)}/refund`, refundData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Send booking confirmation email
   * @param {number} bookingId - Booking ID
   * @returns {Promise<object>} Email confirmation
   */
  sendConfirmationEmail: async (bookingId) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.BOOKING_BY_ID(bookingId)}/send-confirmation`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get train routes and stations
   * @returns {Promise<Array>} List of stations
   */
  getStations: async () => {
    try {
      const response = await api.get('/stations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Get popular routes
   * @returns {Promise<Array>} List of popular routes
   */
  getPopularRoutes: async () => {
    try {
      const response = await api.get('/routes/popular');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
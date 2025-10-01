package com.skm_labs.train_booking_system.service;

import com.skm_labs.train_booking_system.dto.request.BookingRequestDTO;
import com.skm_labs.train_booking_system.dto.request.BookingUpdateDTO;
import com.skm_labs.train_booking_system.dto.request.SearchRequestDTO;
import com.skm_labs.train_booking_system.dto.response.BookingResponseDTO;
import com.skm_labs.train_booking_system.dto.response.TrainScheduleDTO;

import java.util.List;

/**
 * Service interface for Booking operations
 */
public interface BookingService {
    
    /**
     * Get all available station names
     * @return list of unique station names
     */
    List<String> getAllStations();
    
    /**
     * Search available trains based on criteria
     * @param searchRequest search criteria
     * @return list of available train schedules
     */
    List<TrainScheduleDTO> searchTrains(SearchRequestDTO searchRequest);
    
    /**
     * Create a new booking
     * @param bookingRequest booking details
     * @return created booking response
     */
    BookingResponseDTO createBooking(BookingRequestDTO bookingRequest);
    
    /**
     * Update existing booking
     * @param bookingId booking ID
     * @param updateRequest update details
     * @return updated booking response
     */
    BookingResponseDTO updateBooking(Long bookingId, BookingUpdateDTO updateRequest);
    
    /**
     * Cancel booking
     * @param bookingId booking ID
     * @return cancelled booking response
     */
    BookingResponseDTO cancelBooking(Long bookingId);
    
    /**
     * Get booking by PNR number
     * @param pnrNumber PNR number
     * @return booking response
     */
    BookingResponseDTO getBookingByPnr(String pnrNumber);
    
    /**
     * Get all bookings
     * @return list of all bookings
     */
    List<BookingResponseDTO> getAllBookings();
    
    /**
     * Get booking by ID
     * @param bookingId booking ID
     * @return booking response
     */
    BookingResponseDTO getBookingById(Long bookingId);
    
    /**
     * Generate unique PNR number
     * @return generated PNR number
     */
    String generatePNR();
}
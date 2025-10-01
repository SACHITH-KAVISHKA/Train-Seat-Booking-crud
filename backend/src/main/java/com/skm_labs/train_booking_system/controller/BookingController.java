package com.skm_labs.train_booking_system.controller;

import com.skm_labs.train_booking_system.dto.request.BookingRequestDTO;
import com.skm_labs.train_booking_system.dto.request.BookingUpdateDTO;
import com.skm_labs.train_booking_system.dto.request.SearchRequestDTO;
import com.skm_labs.train_booking_system.dto.response.ApiResponseDTO;
import com.skm_labs.train_booking_system.dto.response.BookingResponseDTO;
import com.skm_labs.train_booking_system.dto.response.TrainScheduleDTO;
import com.skm_labs.train_booking_system.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Booking operations
 */
@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {
    
    private final BookingService bookingService;
    
    @GetMapping("/stations")
    public ResponseEntity<ApiResponseDTO<List<String>>> getAllStations() {
        
        log.info("Fetching all available station names");
        
        List<String> stations = bookingService.getAllStations();
        
        String message = stations.isEmpty() ? 
                "No stations found" : 
                String.format("Found %d available stations", stations.size());

        ApiResponseDTO<List<String>> response = ApiResponseDTO.success(message, stations);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<TrainScheduleDTO>>> searchTrains(
            @Valid @RequestBody SearchRequestDTO searchRequest) {
        
        log.info("Train search request: {} to {} on {}", 
                searchRequest.getDepartureStation(), 
                searchRequest.getArrivalStation(), 
                searchRequest.getDepartureDate());
        
        List<TrainScheduleDTO> availableTrains = bookingService.searchTrains(searchRequest);
        
        String message = availableTrains.isEmpty() ? 
                "No trains found for the given criteria" : 
                String.format("Found %d available trains", availableTrains.size());
        
        ApiResponseDTO<List<TrainScheduleDTO>> response = ApiResponseDTO.success(message, availableTrains);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/book")
    public ResponseEntity<ApiResponseDTO<BookingResponseDTO>> createBooking(
            @Valid @RequestBody BookingRequestDTO bookingRequest) {
        
        log.info("Creating booking for passenger: {} on schedule: {}", 
                bookingRequest.getPassengerName(), bookingRequest.getScheduleId());
        log.debug("Booking request details: {}", bookingRequest);
        
        BookingResponseDTO booking = bookingService.createBooking(bookingRequest);
        
        ApiResponseDTO<BookingResponseDTO> response = ApiResponseDTO.success(
                "Booking created successfully", booking);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PutMapping("/{bookingId}")
    public ResponseEntity<ApiResponseDTO<BookingResponseDTO>> updateBooking(
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingUpdateDTO updateRequest) {
        
        log.info("Updating booking ID: {}", bookingId);
        
        BookingResponseDTO booking = bookingService.updateBooking(bookingId, updateRequest);
        
        ApiResponseDTO<BookingResponseDTO> response = ApiResponseDTO.success(
                "Booking updated successfully", booking);
        
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponseDTO<BookingResponseDTO>> cancelBooking(
            @PathVariable Long bookingId) {
        
        log.info("Cancelling booking ID: {}", bookingId);
        
        BookingResponseDTO booking = bookingService.cancelBooking(bookingId);
        
        ApiResponseDTO<BookingResponseDTO> response = ApiResponseDTO.success(
                "Booking cancelled successfully", booking);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/pnr/{pnrNumber}")
    public ResponseEntity<ApiResponseDTO<BookingResponseDTO>> getBookingByPnr(
            @PathVariable String pnrNumber) {
        
        log.info("Fetching booking with PNR: {}", pnrNumber);
        
        BookingResponseDTO booking = bookingService.getBookingByPnr(pnrNumber);
        
        ApiResponseDTO<BookingResponseDTO> response = ApiResponseDTO.success(
                "Booking retrieved successfully", booking);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/all")
    public ResponseEntity<ApiResponseDTO<List<BookingResponseDTO>>> getAllBookings() {
        
        log.info("Fetching all bookings");
        
        List<BookingResponseDTO> bookings = bookingService.getAllBookings();
        
        String message = bookings.isEmpty() ? 
                "No bookings found" : 
                String.format("Found %d bookings", bookings.size());
        
        ApiResponseDTO<List<BookingResponseDTO>> response = ApiResponseDTO.success(message, bookings);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponseDTO<BookingResponseDTO>> getBookingById(
            @PathVariable Long bookingId) {
        
        log.info("Fetching booking with ID: {}", bookingId);
        
        BookingResponseDTO booking = bookingService.getBookingById(bookingId);
        
        ApiResponseDTO<BookingResponseDTO> response = ApiResponseDTO.success(
                "Booking retrieved successfully", booking);
        
        return ResponseEntity.ok(response);
    }
}
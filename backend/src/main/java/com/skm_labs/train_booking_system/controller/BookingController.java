package com.skm_labs.train_booking_system.controller;

import com.skm_labs.train_booking_system.dto.request.BookingRequestDTO;
import com.skm_labs.train_booking_system.dto.request.BookingUpdateDTO;
import com.skm_labs.train_booking_system.dto.request.SearchRequestDTO;
import com.skm_labs.train_booking_system.dto.response.ApiResponseDTO;
import com.skm_labs.train_booking_system.dto.response.BookingResponseDTO;
import com.skm_labs.train_booking_system.dto.response.TrainScheduleDTO;
import com.skm_labs.train_booking_system.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Booking Management", description = "APIs for train search, booking, and booking management")
public class BookingController {
    
    private final BookingService bookingService;
    
    @Operation(summary = "Search available trains", description = "Search for available trains based on departure, arrival stations and date")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Train search completed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid search parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
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
    
    @Operation(summary = "Create a new booking", description = "Create a new train booking")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Booking created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid booking parameters"),
            @ApiResponse(responseCode = "404", description = "User or schedule not found"),
            @ApiResponse(responseCode = "409", description = "Seats not available"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/book")
    public ResponseEntity<ApiResponseDTO<BookingResponseDTO>> createBooking(
            @Valid @RequestBody BookingRequestDTO bookingRequest) {
        
        log.info("Booking creation request for user: {} on schedule: {}", 
                bookingRequest.getUserId(), bookingRequest.getScheduleId());
        
        BookingResponseDTO booking = bookingService.createBooking(bookingRequest);
        
        ApiResponseDTO<BookingResponseDTO> response = ApiResponseDTO.success(
                "Booking created successfully", booking);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @Operation(summary = "Get user bookings", description = "Get all bookings for a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User bookings retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponseDTO<List<BookingResponseDTO>>> getUserBookings(
            @PathVariable Long userId) {
        
        log.info("Fetching bookings for user ID: {}", userId);
        
        List<BookingResponseDTO> userBookings = bookingService.getUserBookings(userId);
        
        String message = userBookings.isEmpty() ? 
                "No bookings found for this user" : 
                String.format("Found %d bookings", userBookings.size());
        
        ApiResponseDTO<List<BookingResponseDTO>> response = ApiResponseDTO.success(message, userBookings);
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Update booking", description = "Update an existing booking")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid update parameters"),
            @ApiResponse(responseCode = "404", description = "Booking not found"),
            @ApiResponse(responseCode = "409", description = "Seats not available or booking cannot be updated"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{bookingId}")
    public ResponseEntity<ApiResponseDTO<BookingResponseDTO>> updateBooking(
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingUpdateDTO updateRequest) {
        
        log.info("Booking update request for booking ID: {}", bookingId);
        
        BookingResponseDTO updatedBooking = bookingService.updateBooking(bookingId, updateRequest);
        
        ApiResponseDTO<BookingResponseDTO> response = ApiResponseDTO.success(
                "Booking updated successfully", updatedBooking);
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Cancel booking", description = "Cancel an existing booking")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking cancelled successfully"),
            @ApiResponse(responseCode = "400", description = "Booking cannot be cancelled"),
            @ApiResponse(responseCode = "404", description = "Booking not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<ApiResponseDTO<BookingResponseDTO>> cancelBooking(
            @PathVariable Long bookingId) {
        
        log.info("Booking cancellation request for booking ID: {}", bookingId);
        
        BookingResponseDTO cancelledBooking = bookingService.cancelBooking(bookingId);
        
        ApiResponseDTO<BookingResponseDTO> response = ApiResponseDTO.success(
                "Booking cancelled successfully", cancelledBooking);
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get booking by PNR", description = "Get booking details by PNR number")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Booking retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Booking not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/pnr/{pnrNumber}")
    public ResponseEntity<ApiResponseDTO<BookingResponseDTO>> getBookingByPnr(
            @PathVariable String pnrNumber) {
        
        log.info("Fetching booking for PNR: {}", pnrNumber);
        
        BookingResponseDTO booking = bookingService.getBookingByPnr(pnrNumber);
        
        ApiResponseDTO<BookingResponseDTO> response = ApiResponseDTO.success(
                "Booking retrieved successfully", booking);
        
        return ResponseEntity.ok(response);
    }
}
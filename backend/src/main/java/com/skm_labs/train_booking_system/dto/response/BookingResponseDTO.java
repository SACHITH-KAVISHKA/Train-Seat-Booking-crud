package com.skm_labs.train_booking_system.dto.response;

import com.skm_labs.train_booking_system.entity.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for booking response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {
    
    private Long bookingId;
    private Long userId;
    private Long scheduleId;
    private String passengerName;
    private String passengerEmail;
    private String passengerPhone;
    private Integer seatCount;
    private Double totalAmount;
    private BookingStatus bookingStatus;
    private LocalDateTime bookingDate;
    private String pnrNumber;
    
    // Schedule details
    private String trainNumber;
    private String trainName;
    private String departureStation;
    private String arrivalStation;
    private String departureDate;
    private String departureTime;
    private String arrivalTime;
}
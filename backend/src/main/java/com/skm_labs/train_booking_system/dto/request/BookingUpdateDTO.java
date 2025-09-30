package com.skm_labs.train_booking_system.dto.request;

import com.skm_labs.train_booking_system.entity.enums.BookingStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating bookings
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingUpdateDTO {
    
    @Size(min = 2, max = 100, message = "Passenger name must be between 2 and 100 characters")
    private String passengerName;
    
    @Email(message = "Invalid email format")
    private String passengerEmail;
    
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number format")
    private String passengerPhone;
    
    @Min(value = 1, message = "Seat count must be at least 1")
    @Max(value = 10, message = "Seat count cannot exceed 10")
    private Integer seatCount;
    
    private BookingStatus bookingStatus;
}
package com.skm_labs.train_booking_system.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating bookings
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDTO {
    
    @NotNull(message = "Schedule ID is required")
    private Long scheduleId;
    
    @NotBlank(message = "Passenger name is required")
    @Size(min = 2, max = 100, message = "Passenger name must be between 2 and 100 characters")
    private String passengerName;
    
    @NotBlank(message = "Passenger email is required")
    @Email(message = "Invalid email format")
    private String passengerEmail;
    
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number format")
    private String passengerPhone;
    
    @NotNull(message = "Seat count is required")
    @Min(value = 1, message = "Seat count must be at least 1")
    @Max(value = 10, message = "Seat count cannot exceed 10")
    private Integer seatCount;
}
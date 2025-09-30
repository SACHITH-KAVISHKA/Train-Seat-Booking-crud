package com.skm_labs.train_booking_system.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for searching trains
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequestDTO {
    
    @NotNull(message = "Departure station is required")
    private String departureStation;
    
    @NotNull(message = "Arrival station is required")
    private String arrivalStation;
    
    @NotNull(message = "Departure date is required")
    private LocalDate departureDate;
    
    @Positive(message = "Seat count must be positive")
    private Integer seatCount = 1;
}
package com.skm_labs.train_booking_system.dto.response;

import com.skm_labs.train_booking_system.entity.enums.TrainType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for train schedule response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainScheduleDTO {
    
    private Long scheduleId;
    private Long trainId;
    private String trainNumber;
    private String trainName;
    private TrainType trainType;
    private String departureStation;
    private String arrivalStation;
    private String departureDate;
    private String departureTime;
    private String arrivalTime;
    private Double fare;
    private Integer availableSeats;
    private Integer totalSeats;
}
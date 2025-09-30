package com.skm_labs.train_booking_system.controller;

import com.skm_labs.train_booking_system.dto.response.ApiResponseDTO;
import com.skm_labs.train_booking_system.entity.Schedule;
import com.skm_labs.train_booking_system.service.ScheduleService;
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
 * REST Controller for Schedule operations (Admin endpoints)
 */
@RestController
@RequestMapping("/admin/schedules")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Schedule Management (Admin)", description = "Admin APIs for schedule management")
public class ScheduleController {
    
    private final ScheduleService scheduleService;
    
    @Operation(summary = "Create a new schedule", description = "Create a new train schedule (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Schedule created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid schedule parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<ApiResponseDTO<Schedule>> createSchedule(
            @Valid @RequestBody Schedule schedule) {
        
        log.info("Schedule creation request for train: {}", schedule.getTrain().getTrainNumber());
        
        Schedule createdSchedule = scheduleService.createSchedule(schedule);
        
        ApiResponseDTO<Schedule> response = ApiResponseDTO.success(
                "Schedule created successfully", createdSchedule);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @Operation(summary = "Update a schedule", description = "Update an existing train schedule (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Schedule updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid schedule parameters"),
            @ApiResponse(responseCode = "404", description = "Schedule not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PutMapping("/{scheduleId}")
    public ResponseEntity<ApiResponseDTO<Schedule>> updateSchedule(
            @PathVariable Long scheduleId,
            @Valid @RequestBody Schedule schedule) {
        
        log.info("Schedule update request for schedule ID: {}", scheduleId);
        
        // Set the ID for the update
        schedule.setId(scheduleId);
        
        // For simplicity, we'll use create method which will update if ID exists
        // In a real application, you'd have a separate update method
        Schedule updatedSchedule = scheduleService.createSchedule(schedule);
        
        ApiResponseDTO<Schedule> response = ApiResponseDTO.success(
                "Schedule updated successfully", updatedSchedule);
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get all schedules", description = "Get all train schedules (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Schedules retrieved successfully"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<Schedule>>> getAllSchedules() {
        
        log.info("Fetching all schedules");
        
        List<Schedule> schedules = scheduleService.getAllSchedules();
        
        String message = schedules.isEmpty() ? 
                "No schedules found" : 
                String.format("Found %d schedules", schedules.size());
        
        ApiResponseDTO<List<Schedule>> response = ApiResponseDTO.success(message, schedules);
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get schedule by ID", description = "Get a specific schedule by ID (Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Schedule retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Schedule not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/{scheduleId}")
    public ResponseEntity<ApiResponseDTO<Schedule>> getScheduleById(
            @PathVariable Long scheduleId) {
        
        log.info("Fetching schedule for ID: {}", scheduleId);
        
        Schedule schedule = scheduleService.findById(scheduleId);
        
        ApiResponseDTO<Schedule> response = ApiResponseDTO.success(
                "Schedule retrieved successfully", schedule);
        
        return ResponseEntity.ok(response);
    }
}
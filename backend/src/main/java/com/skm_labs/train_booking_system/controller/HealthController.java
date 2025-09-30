package com.skm_labs.train_booking_system.controller;

import com.skm_labs.train_booking_system.dto.response.ApiResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Health check controller
 */
@RestController
@RequestMapping("/health")
@Slf4j
@Tag(name = "Health Check", description = "API health check endpoints")
public class HealthController {
    
    @Operation(summary = "Health check", description = "Check if the API is running")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "API is healthy"),
    })
    @GetMapping
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> healthCheck() {
        
        Map<String, Object> healthData = Map.of(
                "status", "UP",
                "timestamp", LocalDateTime.now(),
                "service", "Train Booking System",
                "version", "1.0.0"
        );
        
        ApiResponseDTO<Map<String, Object>> response = ApiResponseDTO.success(
                "Service is running successfully", healthData);
        
        return ResponseEntity.ok(response);
    }
}
package com.skm_labs.train_booking_system.controller;

import com.skm_labs.train_booking_system.dto.request.LoginRequestDTO;
import com.skm_labs.train_booking_system.dto.request.UserRegistrationDTO;
import com.skm_labs.train_booking_system.dto.response.ApiResponseDTO;
import com.skm_labs.train_booking_system.dto.response.UserProfileDTO;
import com.skm_labs.train_booking_system.entity.User;
import com.skm_labs.train_booking_system.service.UserService;
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

import java.util.Map;

/**
 * REST Controller for User operations
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User Management", description = "APIs for user registration, authentication, and profile management")
public class UserController {
    
    private final UserService userService;
    
    @Operation(summary = "Register a new user", description = "Register a new user in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input or email already exists"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> registerUser(
            @Valid @RequestBody UserRegistrationDTO registrationDTO) {
        
        log.info("User registration request received for email: {}", registrationDTO.getEmail());
        
        User user = userService.registerUser(registrationDTO);
        
        Map<String, Object> responseData = Map.of(
                "userId", user.getId(),
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName()
        );
        
        ApiResponseDTO<Map<String, Object>> response = ApiResponseDTO.success(
                "User registered successfully", responseData);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @Operation(summary = "User login", description = "Authenticate user with email and password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User authenticated successfully"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> loginUser(
            @Valid @RequestBody LoginRequestDTO loginRequest) {
        
        log.info("User login request received for email: {}", loginRequest.getEmail());
        
        User user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
        
        Map<String, Object> responseData = Map.of(
                "userId", user.getId(),
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "message", "Login successful"
        );
        
        ApiResponseDTO<Map<String, Object>> response = ApiResponseDTO.success(
                "User authenticated successfully", responseData);
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get user profile", description = "Get user profile information by user ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User profile retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponseDTO<UserProfileDTO>> getUserProfile(
            @PathVariable Long userId) {
        
        log.info("User profile request received for user ID: {}", userId);
        
        UserProfileDTO userProfile = userService.getUserProfile(userId);
        
        ApiResponseDTO<UserProfileDTO> response = ApiResponseDTO.success(
                "User profile retrieved successfully", userProfile);
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Check email availability", description = "Check if email is already registered")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Email availability checked"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping("/check-email")
    public ResponseEntity<ApiResponseDTO<Map<String, Boolean>>> checkEmailAvailability(
            @RequestParam String email) {
        
        log.info("Email availability check for: {}", email);
        
        boolean isExists = userService.isEmailExists(email);
        
        Map<String, Boolean> responseData = Map.of(
                "exists", isExists,
                "available", !isExists
        );
        
        ApiResponseDTO<Map<String, Boolean>> response = ApiResponseDTO.success(
                "Email availability checked", responseData);
        
        return ResponseEntity.ok(response);
    }
}
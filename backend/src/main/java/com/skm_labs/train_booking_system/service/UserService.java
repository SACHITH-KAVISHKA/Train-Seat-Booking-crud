package com.skm_labs.train_booking_system.service;

import com.skm_labs.train_booking_system.dto.request.UserRegistrationDTO;
import com.skm_labs.train_booking_system.dto.response.UserProfileDTO;
import com.skm_labs.train_booking_system.entity.User;

/**
 * Service interface for User operations
 */
public interface UserService {
    
    /**
     * Register a new user
     * @param registrationDTO user registration data
     * @return created user
     */
    User registerUser(UserRegistrationDTO registrationDTO);
    
    /**
     * Authenticate user by email and password
     * @param email user email
     * @param password user password
     * @return authenticated user
     */
    User authenticateUser(String email, String password);
    
    /**
     * Get user profile by ID
     * @param userId user ID
     * @return user profile
     */
    UserProfileDTO getUserProfile(Long userId);
    
    /**
     * Find user by ID
     * @param userId user ID
     * @return user entity
     */
    User findById(Long userId);
    
    /**
     * Check if email already exists
     * @param email email to check
     * @return true if exists, false otherwise
     */
    boolean isEmailExists(String email);
}
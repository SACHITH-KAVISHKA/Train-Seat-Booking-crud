package com.skm_labs.train_booking_system.service.impl;

import com.skm_labs.train_booking_system.dto.request.UserRegistrationDTO;
import com.skm_labs.train_booking_system.dto.response.UserProfileDTO;
import com.skm_labs.train_booking_system.entity.User;
import com.skm_labs.train_booking_system.exception.UserNotFoundException;
import com.skm_labs.train_booking_system.repository.BookingRepository;
import com.skm_labs.train_booking_system.repository.UserRepository;
import com.skm_labs.train_booking_system.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service implementation for User operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    
    @Override
    public User registerUser(UserRegistrationDTO registrationDTO) {
        log.info("Registering new user with email: {}", registrationDTO.getEmail());
        
        // Check if email already exists
        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + registrationDTO.getEmail());
        }
        
        // Create new user
        User user = new User();
        user.setEmail(registrationDTO.getEmail());
        user.setPassword(registrationDTO.getPassword()); // In production, hash the password
        user.setFirstName(registrationDTO.getFirstName());
        user.setLastName(registrationDTO.getLastName());
        user.setPhoneNumber(registrationDTO.getPhoneNumber());
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());
        
        return savedUser;
    }
    
    @Override
    @Transactional(readOnly = true)
    public User authenticateUser(String email, String password) {
        log.info("Authenticating user with email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Invalid email or password"));
        
        // In production, use proper password hashing comparison
        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        
        log.info("User authenticated successfully: {}", email);
        return user;
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(Long userId) {
        log.info("Getting user profile for ID: {}", userId);
        
        User user = findById(userId);
        Long totalBookings = bookingRepository.countByUserId(userId);
        
        return UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .createdAt(user.getCreatedAt())
                .totalBookings(totalBookings.intValue())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
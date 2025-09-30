package com.skm_labs.train_booking_system.repository;

import com.skm_labs.train_booking_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by email
     * @param email user email
     * @return Optional user
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if user exists by email
     * @param email user email
     * @return true if exists, false otherwise
     */
    boolean existsByEmail(String email);
}
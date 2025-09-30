package com.skm_labs.train_booking_system.exception;

/**
 * Exception thrown when train is not found
 */
public class TrainNotFoundException extends RuntimeException {
    
    public TrainNotFoundException(String message) {
        super(message);
    }
    
    public TrainNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public TrainNotFoundException(Long trainId) {
        super("Train not found with id: " + trainId);
    }
}
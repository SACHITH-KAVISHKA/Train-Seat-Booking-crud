package com.skm_labs.train_booking_system.exception;

/**
 * Exception thrown when seats are not available
 */
public class SeatNotAvailableException extends RuntimeException {
    
    public SeatNotAvailableException(String message) {
        super(message);
    }
    
    public SeatNotAvailableException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public SeatNotAvailableException(Integer requestedSeats, Integer availableSeats) {
        super(String.format("Only %d seats available, but %d seats requested", availableSeats, requestedSeats));
    }
}
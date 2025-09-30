package com.skm_labs.train_booking_system.exception;

/**
 * Exception thrown when booking is not found
 */
public class BookingNotFoundException extends RuntimeException {
    
    public BookingNotFoundException(String message) {
        super(message);
    }
    
    public BookingNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public BookingNotFoundException(Long bookingId) {
        super("Booking not found with id: " + bookingId);
    }
}
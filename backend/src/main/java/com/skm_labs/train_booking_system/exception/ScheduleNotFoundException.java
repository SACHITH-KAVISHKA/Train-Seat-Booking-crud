package com.skm_labs.train_booking_system.exception;

/**
 * Exception thrown when schedule is not found
 */
public class ScheduleNotFoundException extends RuntimeException {
    
    public ScheduleNotFoundException(String message) {
        super(message);
    }
    
    public ScheduleNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public ScheduleNotFoundException(Long scheduleId) {
        super("Schedule not found with id: " + scheduleId);
    }
}
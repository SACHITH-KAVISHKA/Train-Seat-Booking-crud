package com.skm_labs.train_booking_system.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the application
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * Handle booking not found exception
     */
    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleBookingNotFoundException(
            BookingNotFoundException ex, WebRequest request) {
        
        ErrorResponse errorResponse = createErrorResponse(
                HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    /**
     * Handle seat not available exception
     */
    @ExceptionHandler(SeatNotAvailableException.class)
    public ResponseEntity<ErrorResponse> handleSeatNotAvailableException(
            SeatNotAvailableException ex, WebRequest request) {
        
        ErrorResponse errorResponse = createErrorResponse(
                HttpStatus.CONFLICT, "Conflict", ex.getMessage(), request);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }
    
    /**
     * Handle train not found exception
     */
    @ExceptionHandler(TrainNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleTrainNotFoundException(
            TrainNotFoundException ex, WebRequest request) {
        
        ErrorResponse errorResponse = createErrorResponse(
                HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    /**
     * Handle schedule not found exception
     */
    @ExceptionHandler(ScheduleNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleScheduleNotFoundException(
            ScheduleNotFoundException ex, WebRequest request) {
        
        ErrorResponse errorResponse = createErrorResponse(
                HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex, WebRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ErrorResponse errorResponse = createErrorResponse(
                HttpStatus.BAD_REQUEST, "Validation Failed", 
                "Invalid input parameters", request);
        errorResponse.setDetails(errors);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Handle illegal argument exception
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        
        ErrorResponse errorResponse = createErrorResponse(
                HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Handle generic exception
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, WebRequest request) {
        
        ErrorResponse errorResponse = createErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", 
                "An unexpected error occurred: " + ex.getMessage(), request);
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    /**
     * Helper method to create error response
     */
    private ErrorResponse createErrorResponse(HttpStatus status, String error, 
                                            String message, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(LocalDateTime.now());
        errorResponse.setStatus(status.value());
        errorResponse.setError(error);
        errorResponse.setMessage(message);
        errorResponse.setPath(request.getDescription(false).replace("uri=", ""));
        return errorResponse;
    }
    
    /**
     * Error response class
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorResponse {
        private LocalDateTime timestamp;
        private int status;
        private String error;
        private String message;
        private String path;
        private Map<String, String> details;
    }
}
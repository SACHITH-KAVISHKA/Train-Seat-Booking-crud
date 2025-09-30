package com.skm_labs.train_booking_system.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

/**
 * Utility class for common operations
 */
public class BookingUtils {
    
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    
    private BookingUtils() {
        // Private constructor to prevent instantiation
    }
    
    /**
     * Generate a unique PNR number
     * @return generated PNR number
     */
    public static String generatePNR() {
        Random random = new Random();
        StringBuilder pnr = new StringBuilder("PNR");
        
        // Generate 6 digit random number
        for (int i = 0; i < 6; i++) {
            pnr.append(random.nextInt(10));
        }
        
        return pnr.toString();
    }
    
    /**
     * Format LocalDateTime to string
     * @param dateTime LocalDateTime to format
     * @return formatted string
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(DATE_TIME_FORMATTER) : null;
    }
    
    /**
     * Format date to string
     * @param date LocalDate to format
     * @return formatted string
     */
    public static String formatDate(java.time.LocalDate date) {
        return date != null ? date.format(DATE_FORMATTER) : null;
    }
    
    /**
     * Format time to string
     * @param time LocalTime to format
     * @return formatted string
     */
    public static String formatTime(java.time.LocalTime time) {
        return time != null ? time.format(TIME_FORMATTER) : null;
    }
    
    /**
     * Calculate total amount based on fare and seat count
     * @param fare fare per seat
     * @param seatCount number of seats
     * @return total amount
     */
    public static Double calculateTotalAmount(Double fare, Integer seatCount) {
        if (fare == null || seatCount == null) {
            return 0.0;
        }
        return fare * seatCount;
    }
    
    /**
     * Validate email format
     * @param email email to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        // Simple email validation regex
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        return email.matches(emailRegex);
    }
    
    /**
     * Validate phone number format
     * @param phoneNumber phone number to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return false;
        }
        
        // Simple phone number validation regex (10-15 digits with optional +)
        String phoneRegex = "^[+]?[0-9]{10,15}$";
        return phoneNumber.matches(phoneRegex);
    }
}
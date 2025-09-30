package com.skm_labs.train_booking_system.service;

/**
 * Service interface for Email operations
 */
public interface EmailService {
    
    /**
     * Send booking confirmation email
     * @param to recipient email
     * @param passengerName passenger name
     * @param pnrNumber PNR number
     * @param trainDetails train details
     */
    void sendBookingConfirmation(String to, String passengerName, String pnrNumber, String trainDetails);
    
    /**
     * Send booking cancellation email
     * @param to recipient email
     * @param passengerName passenger name
     * @param pnrNumber PNR number
     */
    void sendCancellationEmail(String to, String passengerName, String pnrNumber);
}
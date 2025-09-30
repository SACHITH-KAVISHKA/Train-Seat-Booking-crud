package com.skm_labs.train_booking_system.service.impl;

import com.skm_labs.train_booking_system.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service implementation for Email operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {
    
    private final JavaMailSender mailSender;
    
    @Override
    public void sendBookingConfirmation(String to, String passengerName, String pnrNumber, String trainDetails) {
        try {
            log.info("Sending booking confirmation email to: {}", to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Booking Confirmation - PNR: " + pnrNumber);
            message.setText(buildBookingConfirmationText(passengerName, pnrNumber, trainDetails));
            
            mailSender.send(message);
            log.info("Booking confirmation email sent successfully to: {}", to);
            
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email to: {}", to, e);
            // In production, you might want to queue this for retry
        }
    }
    
    @Override
    public void sendCancellationEmail(String to, String passengerName, String pnrNumber) {
        try {
            log.info("Sending cancellation email to: {}", to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Booking Cancellation - PNR: " + pnrNumber);
            message.setText(buildCancellationText(passengerName, pnrNumber));
            
            mailSender.send(message);
            log.info("Cancellation email sent successfully to: {}", to);
            
        } catch (Exception e) {
            log.error("Failed to send cancellation email to: {}", to, e);
            // In production, you might want to queue this for retry
        }
    }
    
    private String buildBookingConfirmationText(String passengerName, String pnrNumber, String trainDetails) {
        return String.format(
            "Dear %s,\n\n" +
            "Your train booking has been confirmed!\n\n" +
            "PNR Number: %s\n" +
            "Train Details: %s\n\n" +
            "Please keep this PNR number for future reference.\n\n" +
            "Thank you for choosing our service!\n\n" +
            "Best regards,\n" +
            "Train Booking System",
            passengerName, pnrNumber, trainDetails
        );
    }
    
    private String buildCancellationText(String passengerName, String pnrNumber) {
        return String.format(
            "Dear %s,\n\n" +
            "Your train booking with PNR %s has been cancelled successfully.\n\n" +
            "If you have any questions, please contact our customer service.\n\n" +
            "Thank you for using our service!\n\n" +
            "Best regards,\n" +
            "Train Booking System",
            passengerName, pnrNumber
        );
    }
}
package com.skm_labs.train_booking_system;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Main application class for Train Booking System
 * 
 * This Spring Boot application provides a complete REST API for train booking management
 * including user registration, train search, booking creation, and booking management.
 */
@SpringBootApplication
@EnableTransactionManagement
@Slf4j
@OpenAPIDefinition(
    info = @Info(
        title = "Train Booking System API",
        version = "1.0.0",
        description = "REST API for Train Booking Management System"
    )
)
public class TrainBookingSystemApplication {

    public static void main(String[] args) {
        log.info("Starting Train Booking System Application...");
        SpringApplication.run(TrainBookingSystemApplication.class, args);
        log.info("Train Booking System Application started successfully!");
        log.info("API Documentation available at: http://localhost:8080/api/swagger-ui.html");
        log.info("OpenAPI Docs available at: http://localhost:8080/api/api-docs");
    }
}

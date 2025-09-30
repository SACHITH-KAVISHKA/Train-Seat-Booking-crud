package com.skm_labs.train_booking_system.entity;

import com.skm_labs.train_booking_system.entity.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Booking entity representing train bookings
 */
@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;
    
    @Column(name = "passenger_name", nullable = false)
    private String passengerName;
    
    @Column(name = "passenger_email", nullable = false)
    private String passengerEmail;
    
    @Column(name = "passenger_phone")
    private String passengerPhone;
    
    @Column(name = "seat_count", nullable = false)
    private Integer seatCount;
    
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false)
    private BookingStatus bookingStatus;
    
    @CreationTimestamp
    @Column(name = "booking_date", nullable = false, updatable = false)
    private LocalDateTime bookingDate;
    
    @Column(name = "pnr_number", unique = true, nullable = false)
    private String pnrNumber;
}
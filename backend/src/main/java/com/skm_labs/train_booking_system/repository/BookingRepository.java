package com.skm_labs.train_booking_system.repository;

import com.skm_labs.train_booking_system.entity.Booking;
import com.skm_labs.train_booking_system.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Booking entity
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    /**
     * Find booking by PNR number
     * @param pnrNumber PNR number
     * @return Optional booking
     */
    Optional<Booking> findByPnrNumber(String pnrNumber);
    
    /**
     * Find bookings by status and booking date before given date
     * @param bookingStatus booking status
     * @param dateTime date time
     * @return List of bookings
     */
    List<Booking> findByBookingStatusAndBookingDateBefore(BookingStatus bookingStatus, LocalDateTime dateTime);
}
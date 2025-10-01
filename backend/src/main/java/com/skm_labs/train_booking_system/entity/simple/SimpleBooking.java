package com.skm_labs.train_booking_system.entity.simple;

import com.skm_labs.train_booking_system.entity.enums.BookingStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Simplified Booking entity without Lombok (for IntelliJ compatibility)
 * Use this if Lombok causes issues in your IDE
 */
@Entity
@Table(name = "bookings_simple")
public class SimpleBooking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
   

    @Column(name = "schedule_id", nullable = false)
    private Long scheduleId;
    
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
    
    @Column(name = "booking_date", nullable = false, updatable = false)
    private LocalDateTime bookingDate;
    
    @Column(name = "pnr_number", unique = true, nullable = false)
    private String pnrNumber;
    
    // Default constructor
    public SimpleBooking() {}
    
    // Constructor with parameters
    public SimpleBooking(Long scheduleId, String passengerName, 
                        String passengerEmail, String passengerPhone, 
                        Integer seatCount, Double totalAmount, 
                        BookingStatus bookingStatus, String pnrNumber) {
        this.scheduleId = scheduleId;
        this.passengerName = passengerName;
        this.passengerEmail = passengerEmail;
        this.passengerPhone = passengerPhone;
        this.seatCount = seatCount;
        this.totalAmount = totalAmount;
        this.bookingStatus = bookingStatus;
        this.pnrNumber = pnrNumber;
        this.bookingDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getScheduleId() { return scheduleId; }
    public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }
    
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    
    public String getPassengerEmail() { return passengerEmail; }
    public void setPassengerEmail(String passengerEmail) { this.passengerEmail = passengerEmail; }
    
    public String getPassengerPhone() { return passengerPhone; }
    public void setPassengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; }
    
    public Integer getSeatCount() { return seatCount; }
    public void setSeatCount(Integer seatCount) { this.seatCount = seatCount; }
    
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    
    public BookingStatus getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(BookingStatus bookingStatus) { this.bookingStatus = bookingStatus; }
    
    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
    
    public String getPnrNumber() { return pnrNumber; }
    public void setPnrNumber(String pnrNumber) { this.pnrNumber = pnrNumber; }
    
    @PrePersist
    protected void onCreate() {
        if (bookingDate == null) {
            bookingDate = LocalDateTime.now();
        }
    }
    
    @Override
    public String toString() {
        return "SimpleBooking{" +
                "id=" + id +
                ", scheduleId=" + scheduleId +
                ", passengerName='" + passengerName + '\'' +
                ", passengerEmail='" + passengerEmail + '\'' +
                ", seatCount=" + seatCount +
                ", totalAmount=" + totalAmount +
                ", bookingStatus=" + bookingStatus +
                ", pnrNumber='" + pnrNumber + '\'' +
                '}';
    }
}
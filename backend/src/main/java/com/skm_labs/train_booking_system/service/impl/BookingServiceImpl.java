package com.skm_labs.train_booking_system.service.impl;

import com.skm_labs.train_booking_system.dto.request.BookingRequestDTO;
import com.skm_labs.train_booking_system.dto.request.BookingUpdateDTO;
import com.skm_labs.train_booking_system.dto.request.SearchRequestDTO;
import com.skm_labs.train_booking_system.dto.response.BookingResponseDTO;
import com.skm_labs.train_booking_system.dto.response.TrainScheduleDTO;
import com.skm_labs.train_booking_system.entity.Booking;
import com.skm_labs.train_booking_system.entity.Schedule;
import com.skm_labs.train_booking_system.entity.enums.BookingStatus;
import com.skm_labs.train_booking_system.exception.BookingNotFoundException;
import com.skm_labs.train_booking_system.exception.SeatNotAvailableException;
import com.skm_labs.train_booking_system.repository.BookingRepository;
import com.skm_labs.train_booking_system.repository.ScheduleRepository;
import com.skm_labs.train_booking_system.service.BookingService;
import com.skm_labs.train_booking_system.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

/**
 * Service implementation for Booking operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookingServiceImpl implements BookingService {
    
    private final BookingRepository bookingRepository;
    private final ScheduleRepository scheduleRepository;
    private final ScheduleService scheduleService;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    
    @Override
    @Transactional(readOnly = true)
    public List<String> getAllStations() {
        log.info("Fetching all available station names");
        
        try {
            List<String> stations = scheduleRepository.findAllUniqueStations();
            log.info("Found {} unique stations", stations.size());
            return stations;
        } catch (Exception e) {
            log.error("Error fetching station names: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch station names", e);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TrainScheduleDTO> searchTrains(SearchRequestDTO searchRequest) {
        log.info("Searching trains from {} to {} on {}", 
                searchRequest.getDepartureStation(), 
                searchRequest.getArrivalStation(), 
                searchRequest.getDepartureDate());
        
        List<Schedule> schedules = scheduleRepository.findAvailableSchedules(
                searchRequest.getDepartureStation(),
                searchRequest.getArrivalStation(),
                searchRequest.getDepartureDate(),
                searchRequest.getSeatCount()
        );
        
        List<TrainScheduleDTO> trainSchedules = schedules.stream()
                .map(this::convertToTrainScheduleDTO)
                .collect(Collectors.toList());
        
        log.info("Found {} available train schedules", trainSchedules.size());
        return trainSchedules;
    }
    
    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO bookingRequest) {
        log.info("Creating booking for passenger: {} on schedule ID: {}", 
                bookingRequest.getPassengerName(), bookingRequest.getScheduleId());
        
        // Validate schedule
        Schedule schedule = scheduleService.findById(bookingRequest.getScheduleId());
        
        // Check seat availability
        if (schedule.getAvailableSeats() < bookingRequest.getSeatCount()) {
            throw new SeatNotAvailableException(
                    bookingRequest.getSeatCount(), schedule.getAvailableSeats());
        }
        
        // Create booking
        Booking booking = new Booking();
        booking.setSchedule(schedule);
        booking.setUserId(1L); // TODO: Set actual user ID when User authentication is implemented
        booking.setPassengerName(bookingRequest.getPassengerName());
        booking.setPassengerEmail(bookingRequest.getPassengerEmail());
        booking.setPassengerPhone(bookingRequest.getPassengerPhone());
        booking.setSeatCount(bookingRequest.getSeatCount());
        booking.setTotalAmount(schedule.getFare() * bookingRequest.getSeatCount());
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setPnrNumber(generatePNR());
        
        // Save booking
        Booking savedBooking = bookingRepository.save(booking);
        
        // Update available seats
        scheduleService.updateAvailableSeats(schedule.getId(), -bookingRequest.getSeatCount());
        
        log.info("Booking created successfully with PNR: {}", savedBooking.getPnrNumber());
        return convertToBookingResponseDTO(savedBooking);
    }
    
    @Override
    public BookingResponseDTO updateBooking(Long bookingId, BookingUpdateDTO updateRequest) {
        log.info("Updating booking ID: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));
        
        // Check if booking can be updated (only pending or confirmed bookings)
        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot update cancelled booking");
        }
        
        // Update fields if provided
        if (updateRequest.getPassengerName() != null) {
            booking.setPassengerName(updateRequest.getPassengerName());
        }
        if (updateRequest.getPassengerEmail() != null) {
            booking.setPassengerEmail(updateRequest.getPassengerEmail());
        }
        if (updateRequest.getPassengerPhone() != null) {
            booking.setPassengerPhone(updateRequest.getPassengerPhone());
        }
        if (updateRequest.getBookingStatus() != null) {
            booking.setBookingStatus(updateRequest.getBookingStatus());
        }
        
        // Handle seat count change
        if (updateRequest.getSeatCount() != null && 
            !updateRequest.getSeatCount().equals(booking.getSeatCount())) {
            
            int seatDifference = updateRequest.getSeatCount() - booking.getSeatCount();
            
            // Check availability for additional seats
            if (seatDifference > 0) {
                Schedule schedule = booking.getSchedule();
                if (schedule.getAvailableSeats() < seatDifference) {
                    throw new SeatNotAvailableException(seatDifference, schedule.getAvailableSeats());
                }
            }
            
            // Update seats in schedule
            scheduleService.updateAvailableSeats(booking.getSchedule().getId(), -seatDifference);
            
            // Update booking
            booking.setSeatCount(updateRequest.getSeatCount());
            booking.setTotalAmount(booking.getSchedule().getFare() * updateRequest.getSeatCount());
        }
        
        Booking updatedBooking = bookingRepository.save(booking);
        log.info("Booking updated successfully: {}", bookingId);
        
        return convertToBookingResponseDTO(updatedBooking);
    }
    
    @Override
    public BookingResponseDTO cancelBooking(Long bookingId) {
        log.info("Cancelling booking ID: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));
        
        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled");
        }
        
        // Update booking status
        booking.setBookingStatus(BookingStatus.CANCELLED);
        Booking cancelledBooking = bookingRepository.save(booking);
        
        // Release seats
        scheduleService.updateAvailableSeats(booking.getSchedule().getId(), booking.getSeatCount());
        
        log.info("Booking cancelled successfully: {}", bookingId);
        return convertToBookingResponseDTO(cancelledBooking);
    }
    
    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingByPnr(String pnrNumber) {
        log.info("Fetching booking by PNR: {}", pnrNumber);
        
        Booking booking = bookingRepository.findByPnrNumber(pnrNumber)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with PNR: " + pnrNumber));
        
        return convertToBookingResponseDTO(booking);
    }
    
    @Override
    public String generatePNR() {
        Random random = new Random();
        StringBuilder pnr = new StringBuilder("PNR");
        
        // Generate 6 digit random number
        for (int i = 0; i < 6; i++) {
            pnr.append(random.nextInt(10));
        }
        
        // Check if PNR already exists (very unlikely but good to check)
        String pnrNumber = pnr.toString();
        while (bookingRepository.findByPnrNumber(pnrNumber).isPresent()) {
            pnr = new StringBuilder("PNR");
            for (int i = 0; i < 6; i++) {
                pnr.append(random.nextInt(10));
            }
            pnrNumber = pnr.toString();
        }
        
        return pnrNumber;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getAllBookings() {
        log.info("Fetching all bookings");
        
        List<Booking> bookings = bookingRepository.findAll();
        
        List<BookingResponseDTO> bookingResponses = bookings.stream()
                .map(this::convertToBookingResponseDTO)
                .collect(Collectors.toList());
        
        log.info("Found {} bookings", bookingResponses.size());
        return bookingResponses;
    }
    
    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long bookingId) {
        log.info("Fetching booking by ID: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));
        
        return convertToBookingResponseDTO(booking);
    }
    
    private TrainScheduleDTO convertToTrainScheduleDTO(Schedule schedule) {
        return TrainScheduleDTO.builder()
                .scheduleId(schedule.getId())
                .trainId(schedule.getTrain().getId())
                .trainNumber(schedule.getTrain().getTrainNumber())
                .trainName(schedule.getTrain().getTrainName())
                .trainType(schedule.getTrain().getTrainType())
                .departureStation(schedule.getDepartureStation())
                .arrivalStation(schedule.getArrivalStation())
                .departureDate(schedule.getDepartureDate().format(DATE_FORMATTER))
                .departureTime(schedule.getDepartureTime().format(TIME_FORMATTER))
                .arrivalTime(schedule.getArrivalTime().format(TIME_FORMATTER))
                .fare(schedule.getFare())
                .availableSeats(schedule.getAvailableSeats())
                .totalSeats(schedule.getTrain().getTotalSeats())
                .build();
    }
    
    private BookingResponseDTO convertToBookingResponseDTO(Booking booking) {
        return BookingResponseDTO.builder()
                .bookingId(booking.getId())
                .scheduleId(booking.getSchedule().getId())
                .passengerName(booking.getPassengerName())
                .passengerEmail(booking.getPassengerEmail())
                .passengerPhone(booking.getPassengerPhone())
                .seatCount(booking.getSeatCount())
                .totalAmount(booking.getTotalAmount())
                .bookingStatus(booking.getBookingStatus())
                .bookingDate(booking.getBookingDate())
                .pnrNumber(booking.getPnrNumber())
                .trainNumber(booking.getSchedule().getTrain().getTrainNumber())
                .trainName(booking.getSchedule().getTrain().getTrainName())
                .departureStation(booking.getSchedule().getDepartureStation())
                .arrivalStation(booking.getSchedule().getArrivalStation())
                .departureDate(booking.getSchedule().getDepartureDate().format(DATE_FORMATTER))
                .departureTime(booking.getSchedule().getDepartureTime().format(TIME_FORMATTER))
                .arrivalTime(booking.getSchedule().getArrivalTime().format(TIME_FORMATTER))
                .build();
    }
}
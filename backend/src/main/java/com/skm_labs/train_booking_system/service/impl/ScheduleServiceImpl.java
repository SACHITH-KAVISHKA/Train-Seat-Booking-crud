package com.skm_labs.train_booking_system.service.impl;

import com.skm_labs.train_booking_system.entity.Schedule;
import com.skm_labs.train_booking_system.exception.ScheduleNotFoundException;
import com.skm_labs.train_booking_system.exception.SeatNotAvailableException;
import com.skm_labs.train_booking_system.repository.ScheduleRepository;
import com.skm_labs.train_booking_system.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service implementation for Schedule operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ScheduleServiceImpl implements ScheduleService {
    
    private final ScheduleRepository scheduleRepository;
    
    @Override
    public Schedule createSchedule(Schedule schedule) {
        log.info("Creating new schedule for train: {}", schedule.getTrain().getTrainNumber());
        
        // Set available seats equal to train's total seats initially
        schedule.setAvailableSeats(schedule.getTrain().getTotalSeats());
        
        Schedule savedSchedule = scheduleRepository.save(schedule);
        log.info("Schedule created successfully with ID: {}", savedSchedule.getId());
        
        return savedSchedule;
    }
    
    @Override
    public Schedule updateAvailableSeats(Long scheduleId, Integer seatChange) {
        log.info("Updating available seats for schedule ID: {} by: {}", scheduleId, seatChange);
        
        Schedule schedule = findById(scheduleId);
        int newAvailableSeats = schedule.getAvailableSeats() + seatChange;
        
        // Check if the operation would result in negative seats
        if (newAvailableSeats < 0) {
            throw new SeatNotAvailableException(
                    Math.abs(seatChange), schedule.getAvailableSeats());
        }
        
        // Check if available seats exceed total seats
        if (newAvailableSeats > schedule.getTrain().getTotalSeats()) {
            throw new IllegalArgumentException("Available seats cannot exceed total seats");
        }
        
        schedule.setAvailableSeats(newAvailableSeats);
        Schedule updatedSchedule = scheduleRepository.save(schedule);
        
        log.info("Available seats updated successfully. New count: {}", newAvailableSeats);
        return updatedSchedule;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Schedule> getAllSchedules() {
        log.info("Fetching all schedules");
        return scheduleRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Schedule findById(Long scheduleId) {
        return scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ScheduleNotFoundException(scheduleId));
    }
}
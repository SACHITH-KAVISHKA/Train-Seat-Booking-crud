package com.skm_labs.train_booking_system.service;

import com.skm_labs.train_booking_system.entity.Schedule;

import java.util.List;

/**
 * Service interface for Schedule operations
 */
public interface ScheduleService {
    
    /**
     * Create a new schedule
     * @param schedule schedule to create
     * @return created schedule
     */
    Schedule createSchedule(Schedule schedule);
    
    /**
     * Update available seats for a schedule
     * @param scheduleId schedule ID
     * @param seatChange change in seat count (negative for booking, positive for cancellation)
     * @return updated schedule
     */
    Schedule updateAvailableSeats(Long scheduleId, Integer seatChange);
    
    /**
     * Get all schedules
     * @return list of all schedules
     */
    List<Schedule> getAllSchedules();
    
    /**
     * Find schedule by ID
     * @param scheduleId schedule ID
     * @return schedule entity
     */
    Schedule findById(Long scheduleId);
}
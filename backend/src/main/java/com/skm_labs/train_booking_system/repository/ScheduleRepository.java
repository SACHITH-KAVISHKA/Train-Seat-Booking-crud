package com.skm_labs.train_booking_system.repository;

import com.skm_labs.train_booking_system.entity.Schedule;
import com.skm_labs.train_booking_system.entity.enums.TrainType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for Schedule entity
 */
@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    /**
     * Find schedules by departure station, arrival station and departure date
     * @param departureStation departure station
     * @param arrivalStation arrival station
     * @param departureDate departure date
     * @return List of schedules
     */
    List<Schedule> findByDepartureStationAndArrivalStationAndDepartureDate(
            String departureStation, String arrivalStation, LocalDate departureDate);
    
    /**
     * Find schedules by departure date
     * @param departureDate departure date
     * @return List of schedules
     */
    List<Schedule> findByDepartureDate(LocalDate departureDate);
    
    /**
     * Find schedules by train type
     * @param trainType train type
     * @return List of schedules
     */
    @Query("SELECT s FROM Schedule s WHERE s.train.trainType = :trainType")
    List<Schedule> findByTrain_TrainType(@Param("trainType") TrainType trainType);
    
    /**
     * Find schedules with available seats for search criteria
     * @param departureStation departure station
     * @param arrivalStation arrival station
     * @param departureDate departure date
     * @param requiredSeats required number of seats
     * @return List of schedules
     */
    @Query("SELECT s FROM Schedule s WHERE s.departureStation = :departureStation " +
           "AND s.arrivalStation = :arrivalStation " +
           "AND s.departureDate = :departureDate " +
           "AND s.availableSeats >= :requiredSeats " +
           "ORDER BY s.departureTime")
    List<Schedule> findAvailableSchedules(@Param("departureStation") String departureStation,
                                        @Param("arrivalStation") String arrivalStation,
                                        @Param("departureDate") LocalDate departureDate,
                                        @Param("requiredSeats") Integer requiredSeats);
    
    /**
     * Find all unique station names (both departure and arrival stations)
     * @return List of unique station names
     */
    @Query("SELECT DISTINCT s.departureStation FROM Schedule s " +
           "UNION " +
           "SELECT DISTINCT s.arrivalStation FROM Schedule s " +
           "ORDER BY 1")
    List<String> findAllUniqueStations();
}
package com.skm_labs.train_booking_system.config;

import com.skm_labs.train_booking_system.entity.Schedule;
import com.skm_labs.train_booking_system.entity.Train;
import com.skm_labs.train_booking_system.entity.User;
import com.skm_labs.train_booking_system.entity.enums.TrainType;
import com.skm_labs.train_booking_system.repository.ScheduleRepository;
import com.skm_labs.train_booking_system.repository.TrainRepository;
import com.skm_labs.train_booking_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

/**
 * Data initializer to populate the database with sample data
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final TrainRepository trainRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    
    @Override
    public void run(String... args) throws Exception {
        log.info("Starting data initialization...");
        
        // Initialize only if database is empty
        if (trainRepository.count() == 0) {
            initializeTrains();
            initializeUsers();
            initializeSchedules();
            log.info("Sample data initialization completed successfully!");
        } else {
            log.info("Database already contains data. Skipping initialization.");
        }
    }
    
    private void initializeTrains() {
        log.info("Initializing sample trains...");
        
        List<Train> trains = Arrays.asList(
                createTrain("TR001", "Rajdhani Express", TrainType.FIRST_CLASS, 300),
                createTrain("TR002", "Shatabdi Express", TrainType.FIRST_CLASS, 250),
                createTrain("TR003", "Duronto Express", TrainType.SECOND_CLASS, 400),
                createTrain("TR004", "Garib Rath", TrainType.THIRD_CLASS, 500),
                createTrain("TR005", "Jan Shatabdi", TrainType.SECOND_CLASS, 350)
        );
        
        trainRepository.saveAll(trains);
        log.info("Created {} sample trains", trains.size());
    }
    
    private void initializeUsers() {
        log.info("Initializing sample users...");
        
        List<User> users = Arrays.asList(
                createUser("john.doe@email.com", "password123", "John", "Doe", "+1234567890"),
                createUser("jane.smith@email.com", "password123", "Jane", "Smith", "+1234567891"),
                createUser("admin@email.com", "admin123", "Admin", "User", "+1234567892")
        );
        
        userRepository.saveAll(users);
        log.info("Created {} sample users", users.size());
    }
    
    private void initializeSchedules() {
        log.info("Initializing sample schedules...");
        
        List<Train> trains = trainRepository.findAll();
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        LocalDate dayAfterTomorrow = today.plusDays(2);
        
        List<Schedule> schedules = Arrays.asList(
                // Rajdhani Express schedules
                createSchedule(trains.get(0), "New Delhi", "Mumbai", tomorrow, 
                        LocalTime.of(16, 30), LocalTime.of(8, 30), 2500.0),
                createSchedule(trains.get(0), "Mumbai", "New Delhi", dayAfterTomorrow, 
                        LocalTime.of(17, 0), LocalTime.of(9, 0), 2500.0),
                
                // Shatabdi Express schedules
                createSchedule(trains.get(1), "New Delhi", "Chandigarh", tomorrow, 
                        LocalTime.of(7, 20), LocalTime.of(10, 45), 800.0),
                createSchedule(trains.get(1), "Chandigarh", "New Delhi", tomorrow, 
                        LocalTime.of(18, 30), LocalTime.of(21, 55), 800.0),
                
                // Duronto Express schedules
                createSchedule(trains.get(2), "Kolkata", "New Delhi", tomorrow, 
                        LocalTime.of(22, 5), LocalTime.of(10, 15), 1800.0),
                createSchedule(trains.get(2), "New Delhi", "Kolkata", dayAfterTomorrow, 
                        LocalTime.of(16, 50), LocalTime.of(5, 0), 1800.0),
                
                // Garib Rath schedules
                createSchedule(trains.get(3), "Chennai", "New Delhi", tomorrow, 
                        LocalTime.of(11, 40), LocalTime.of(7, 15), 1200.0),
                createSchedule(trains.get(3), "New Delhi", "Chennai", dayAfterTomorrow, 
                        LocalTime.of(20, 30), LocalTime.of(16, 5), 1200.0),
                
                // Jan Shatabdi schedules
                createSchedule(trains.get(4), "Bangalore", "Chennai", tomorrow, 
                        LocalTime.of(6, 0), LocalTime.of(11, 30), 600.0),
                createSchedule(trains.get(4), "Chennai", "Bangalore", tomorrow, 
                        LocalTime.of(14, 0), LocalTime.of(19, 30), 600.0)
        );
        
        scheduleRepository.saveAll(schedules);
        log.info("Created {} sample schedules", schedules.size());
    }
    
    private Train createTrain(String trainNumber, String trainName, TrainType trainType, int totalSeats) {
        Train train = new Train();
        train.setTrainNumber(trainNumber);
        train.setTrainName(trainName);
        train.setTrainType(trainType);
        train.setTotalSeats(totalSeats);
        train.setAvailableSeats(totalSeats);
        return train;
    }
    
    private User createUser(String email, String password, String firstName, String lastName, String phoneNumber) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(password); // In production, this should be hashed
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhoneNumber(phoneNumber);
        return user;
    }
    
    private Schedule createSchedule(Train train, String departureStation, String arrivalStation, 
                                  LocalDate departureDate, LocalTime departureTime, 
                                  LocalTime arrivalTime, Double fare) {
        Schedule schedule = new Schedule();
        schedule.setTrain(train);
        schedule.setDepartureStation(departureStation);
        schedule.setArrivalStation(arrivalStation);
        schedule.setDepartureDate(departureDate);
        schedule.setDepartureTime(departureTime);
        schedule.setArrivalTime(arrivalTime);
        schedule.setFare(fare);
        schedule.setAvailableSeats(train.getTotalSeats());
        return schedule;
    }
}
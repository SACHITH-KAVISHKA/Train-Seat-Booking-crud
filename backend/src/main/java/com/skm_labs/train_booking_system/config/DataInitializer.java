package com.skm_labs.train_booking_system.config;

import com.skm_labs.train_booking_system.entity.Schedule;
import com.skm_labs.train_booking_system.entity.Train;
import com.skm_labs.train_booking_system.entity.enums.TrainType;
import com.skm_labs.train_booking_system.repository.ScheduleRepository;
import com.skm_labs.train_booking_system.repository.TrainRepository;
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
    
    @Override
    public void run(String... args) throws Exception {
        log.info("Starting Sri Lankan train data initialization...");
        
        // Clear existing data and reinitialize with Sri Lankan data
        clearExistingData();
        initializeSriLankanTrains();
        initializeSriLankanSchedules();
        log.info("Sri Lankan train data initialization completed successfully!");
    }
    
    private void clearExistingData() {
        log.info("Clearing existing train and schedule data...");
        scheduleRepository.deleteAll();
        trainRepository.deleteAll();
        log.info("Existing data cleared successfully");
    }
    
    private void initializeSriLankanTrains() {
        log.info("Initializing Sri Lankan trains...");
        
        List<Train> trains = Arrays.asList(
                // Intercity Express Trains
                createTrain("ICE001", "Podi Menike", TrainType.FIRST_CLASS, 280),
                createTrain("ICE002", "Udarata Menike", TrainType.FIRST_CLASS, 300),
                createTrain("ICE003", "Rajarata Rajini", TrainType.SECOND_CLASS, 350),
                createTrain("ICE004", "Ruhunu Kumari", TrainType.SECOND_CLASS, 320),
                createTrain("ICE005", "Yal Devi", TrainType.FIRST_CLASS, 250),
                
                // Express Trains  
                createTrain("EXP006", "Uttara Devi", TrainType.SECOND_CLASS, 400),
                createTrain("EXP007", "Galu Kumari", TrainType.SECOND_CLASS, 380),
                createTrain("EXP008", "Sagarika", TrainType.THIRD_CLASS, 450),
                createTrain("EXP009", "Samudra Devi", TrainType.THIRD_CLASS, 420),
                createTrain("EXP010", "Ran Kumari", TrainType.SECOND_CLASS, 350),
                
                // Night Mail Trains
                createTrain("NM011", "Upcountry Night Mail", TrainType.SECOND_CLASS, 300),
                createTrain("NM012", "Southern Night Mail", TrainType.THIRD_CLASS, 380),
                
                // Special Trains
                createTrain("SP013", "Viceroy Special", TrainType.FIRST_CLASS, 200),
                createTrain("SP014", "Kandy Esala Special", TrainType.FIRST_CLASS, 180),
                createTrain("SP015", "Coastal Line Express", TrainType.SECOND_CLASS, 320)
        );
        
        trainRepository.saveAll(trains);
        log.info("Created {} Sri Lankan trains", trains.size());
    }
    
    private void initializeSriLankanSchedules() {
        log.info("Initializing Sri Lankan train schedules...");
        
        List<Train> trains = trainRepository.findAll();
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        LocalDate dayAfterTomorrow = today.plusDays(2);
        
        List<Schedule> schedules = Arrays.asList(
                // Podi Menike (Colombo Fort - Badulla)
                createSchedule(trains.get(0), "Colombo Fort", "Badulla", tomorrow, 
                        LocalTime.of(5, 55), LocalTime.of(14, 48), 1850.0),
                createSchedule(trains.get(0), "Badulla", "Colombo Fort", dayAfterTomorrow, 
                        LocalTime.of(8, 30), LocalTime.of(17, 30), 1850.0),
                
                // Udarata Menike (Colombo Fort - Badulla)
                createSchedule(trains.get(1), "Colombo Fort", "Badulla", tomorrow, 
                        LocalTime.of(9, 35), LocalTime.of(18, 45), 2100.0),
                createSchedule(trains.get(1), "Badulla", "Colombo Fort", tomorrow, 
                        LocalTime.of(11, 10), LocalTime.of(20, 15), 2100.0),
                
                // Rajarata Rajini (Colombo Fort - Vavuniya)
                createSchedule(trains.get(2), "Colombo Fort", "Vavuniya", tomorrow, 
                        LocalTime.of(7, 25), LocalTime.of(13, 45), 950.0),
                createSchedule(trains.get(2), "Vavuniya", "Colombo Fort", tomorrow, 
                        LocalTime.of(14, 30), LocalTime.of(20, 50), 950.0),
                
                // Ruhunu Kumari (Colombo Fort - Matara)
                createSchedule(trains.get(3), "Colombo Fort", "Matara", tomorrow, 
                        LocalTime.of(6, 0), LocalTime.of(9, 45), 420.0),
                createSchedule(trains.get(3), "Matara", "Colombo Fort", tomorrow, 
                        LocalTime.of(15, 30), LocalTime.of(19, 15), 420.0),
                
                // Yal Devi (Colombo Fort - Jaffna)
                createSchedule(trains.get(4), "Colombo Fort", "Jaffna", tomorrow, 
                        LocalTime.of(5, 50), LocalTime.of(17, 40), 1680.0),
                createSchedule(trains.get(4), "Jaffna", "Colombo Fort", dayAfterTomorrow, 
                        LocalTime.of(5, 45), LocalTime.of(17, 35), 1680.0),
                
                // Uttara Devi (Colombo Fort - Kankesanturai)
                createSchedule(trains.get(5), "Colombo Fort", "Kankesanturai", tomorrow, 
                        LocalTime.of(22, 45), LocalTime.of(12, 30), 1450.0),
                createSchedule(trains.get(5), "Kankesanturai", "Colombo Fort", dayAfterTomorrow, 
                        LocalTime.of(13, 15), LocalTime.of(3, 0), 1450.0),
                
                // Galu Kumari (Colombo Fort - Galle)
                createSchedule(trains.get(6), "Colombo Fort", "Galle", tomorrow, 
                        LocalTime.of(7, 15), LocalTime.of(10, 5), 350.0),
                createSchedule(trains.get(6), "Galle", "Colombo Fort", tomorrow, 
                        LocalTime.of(17, 45), LocalTime.of(20, 35), 350.0),
                
                // Sagarika (Colombo Fort - Matara)
                createSchedule(trains.get(7), "Colombo Fort", "Matara", tomorrow, 
                        LocalTime.of(15, 35), LocalTime.of(19, 30), 280.0),
                createSchedule(trains.get(7), "Matara", "Colombo Fort", dayAfterTomorrow, 
                        LocalTime.of(6, 25), LocalTime.of(10, 20), 280.0),
                
                // Samudra Devi (Colombo Fort - Beliatta)
                createSchedule(trains.get(8), "Colombo Fort", "Beliatta", tomorrow, 
                        LocalTime.of(6, 35), LocalTime.of(11, 20), 480.0),
                createSchedule(trains.get(8), "Beliatta", "Colombo Fort", tomorrow, 
                        LocalTime.of(14, 15), LocalTime.of(19, 0), 480.0),
                
                // Ran Kumari (Colombo Fort - Kandy)
                createSchedule(trains.get(9), "Colombo Fort", "Kandy", tomorrow, 
                        LocalTime.of(6, 30), LocalTime.of(9, 15), 520.0),
                createSchedule(trains.get(9), "Kandy", "Colombo Fort", tomorrow, 
                        LocalTime.of(16, 0), LocalTime.of(18, 45), 520.0),
                
                // Upcountry Night Mail (Colombo Fort - Badulla)
                createSchedule(trains.get(10), "Colombo Fort", "Badulla", tomorrow, 
                        LocalTime.of(20, 30), LocalTime.of(6, 50), 1280.0),
                createSchedule(trains.get(10), "Badulla", "Colombo Fort", dayAfterTomorrow, 
                        LocalTime.of(21, 0), LocalTime.of(7, 20), 1280.0),
                
                // Southern Night Mail (Colombo Fort - Matara)
                createSchedule(trains.get(11), "Colombo Fort", "Matara", tomorrow, 
                        LocalTime.of(21, 45), LocalTime.of(2, 35), 320.0),
                createSchedule(trains.get(11), "Matara", "Colombo Fort", dayAfterTomorrow, 
                        LocalTime.of(22, 30), LocalTime.of(3, 20), 320.0),
                
                // Viceroy Special (Colombo Fort - Kandy)
                createSchedule(trains.get(12), "Colombo Fort", "Kandy", tomorrow, 
                        LocalTime.of(8, 30), LocalTime.of(11, 0), 850.0),
                createSchedule(trains.get(12), "Kandy", "Colombo Fort", tomorrow, 
                        LocalTime.of(15, 30), LocalTime.of(18, 0), 850.0),
                
                // Kandy Esala Special (Colombo Fort - Kandy)
                createSchedule(trains.get(13), "Colombo Fort", "Kandy", tomorrow, 
                        LocalTime.of(10, 15), LocalTime.of(12, 45), 950.0),
                createSchedule(trains.get(13), "Kandy", "Colombo Fort", tomorrow, 
                        LocalTime.of(17, 15), LocalTime.of(19, 45), 950.0),
                
                // Coastal Line Express (Colombo Fort - Galle)
                createSchedule(trains.get(14), "Colombo Fort", "Galle", tomorrow, 
                        LocalTime.of(14, 20), LocalTime.of(17, 15), 380.0),
                createSchedule(trains.get(14), "Galle", "Colombo Fort", tomorrow, 
                        LocalTime.of(8, 45), LocalTime.of(11, 40), 380.0)
        );
        
        scheduleRepository.saveAll(schedules);
        log.info("Created {} Sri Lankan train schedules", schedules.size());
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
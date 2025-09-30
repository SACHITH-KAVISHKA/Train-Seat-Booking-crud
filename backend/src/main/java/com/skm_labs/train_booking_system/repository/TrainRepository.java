package com.skm_labs.train_booking_system.repository;

import com.skm_labs.train_booking_system.entity.Train;
import com.skm_labs.train_booking_system.entity.enums.TrainType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Train entity
 */
@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {
    
    /**
     * Find train by train number
     * @param trainNumber train number
     * @return Optional train
     */
    Optional<Train> findByTrainNumber(String trainNumber);
    
    /**
     * Find trains by train type
     * @param trainType train type
     * @return List of trains
     */
    List<Train> findByTrainType(TrainType trainType);
}
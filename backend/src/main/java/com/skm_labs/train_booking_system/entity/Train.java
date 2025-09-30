package com.skm_labs.train_booking_system.entity;

import com.skm_labs.train_booking_system.entity.enums.TrainType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Train entity representing trains in the system
 */
@Entity
@Table(name = "trains")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Train {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "train_number", unique = true, nullable = false)
    private String trainNumber;
    
    @Column(name = "train_name", nullable = false)
    private String trainName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "train_type", nullable = false)
    private TrainType trainType;
    
    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;
    
    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;
    
    @OneToMany(mappedBy = "train", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Schedule> schedules;
}
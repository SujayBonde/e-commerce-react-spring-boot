package com.ecommerce.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    private String id = UUID.randomUUID().toString();

    private String userId;

    // Storing items as JSON String
    @Column(columnDefinition = "TEXT")
    private String items;

    // Storing address as JSON String
    @Column(columnDefinition = "TEXT")
    private String address;

    private double amount;
    private String status;
    private String paymentMethod;
    private boolean payment;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
}

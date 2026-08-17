package com.ecommerce.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    private String id = UUID.randomUUID().toString();

    private String name;
    
    @Column(unique = true)
    private String email;
    
    private String password;

    // Storing cartData as JSON String for simplicity
    @Column(columnDefinition = "TEXT")
    private String cartData;

}

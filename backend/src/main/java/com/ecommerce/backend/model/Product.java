package com.ecommerce.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products")
@Data
public class Product {

    @Id
    private String id = UUID.randomUUID().toString();

    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private double price;
    
    private String category;
    private String subCategory;
    private boolean bestseller;

    @ElementCollection
    private List<String> sizes;

    @ElementCollection
    private List<String> image;
}

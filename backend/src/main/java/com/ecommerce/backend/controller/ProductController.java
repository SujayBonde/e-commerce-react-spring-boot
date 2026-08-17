package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.ProductRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/add")
    public Map<String, Object> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("category") String category,
            @RequestParam("subCategory") String subCategory,
            @RequestParam("bestseller") boolean bestseller,
            @RequestParam("sizes") String sizesStr,
            @RequestParam(value = "image1", required = false) MultipartFile image1,
            @RequestParam(value = "image2", required = false) MultipartFile image2,
            @RequestParam(value = "image3", required = false) MultipartFile image3,
            @RequestParam(value = "image4", required = false) MultipartFile image4
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setCategory(category);
            product.setSubCategory(subCategory);
            product.setBestseller(bestseller);

            ObjectMapper mapper = new ObjectMapper();
            List<String> sizes = mapper.readValue(sizesStr, new TypeReference<List<String>>() {});
            product.setSizes(sizes);

            List<String> imageUrls = new ArrayList<>();
            imageUrls.add(saveImage(image1));
            imageUrls.add(saveImage(image2));
            imageUrls.add(saveImage(image3));
            imageUrls.add(saveImage(image4));
            
            imageUrls.removeIf(Objects::isNull);

            product.setImage(imageUrls);

            productRepository.save(product);

            response.put("success", true);
            response.put("message", "Product added successfully");
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    private String saveImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        String uploadDir = new File("uploads").getAbsolutePath();
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File dest = new File(dir, fileName);
        file.transferTo(dest);

        return "http://localhost:8080/uploads/" + fileName;
    }

    @GetMapping("/list")
    public Map<String, Object> listProducts() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Product> products = productRepository.findAll();
            response.put("success", true);
            response.put("products", products);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/remove")
    public Map<String, Object> removeProduct(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            String id = body.get("id");
            productRepository.deleteById(id);
            response.put("success", true);
            response.put("message", "Product removed successfully");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }
}

package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private UserRepository userRepository;

    private ObjectMapper mapper = new ObjectMapper();

    private User getAuthenticatedUser() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userId).orElse(null);
    }

    private Map<String, Map<String, Integer>> getCartDataMap(User user) {
        try {
            if (user.getCartData() == null || user.getCartData().isEmpty()) {
                return new HashMap<>();
            }
            return mapper.readValue(user.getCartData(), new TypeReference<Map<String, Map<String, Integer>>>() {});
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    @PostMapping("/add")
    public Map<String, Object> addToCart(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = getAuthenticatedUser();
            if (user == null) throw new Exception("User not found");

            String itemId = body.get("itemId");
            String size = body.get("size");

            Map<String, Map<String, Integer>> cartData = getCartDataMap(user);

            cartData.putIfAbsent(itemId, new HashMap<>());
            Map<String, Integer> itemData = cartData.get(itemId);
            itemData.put(size, itemData.getOrDefault(size, 0) + 1);

            user.setCartData(mapper.writeValueAsString(cartData));
            userRepository.save(user);

            response.put("success", true);
            response.put("message", "Added to cart");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/update")
    public Map<String, Object> updateCart(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = getAuthenticatedUser();
            if (user == null) throw new Exception("User not found");

            String itemId = (String) body.get("itemId");
            String size = (String) body.get("size");
            int quantity = (Integer) body.get("quantity");

            Map<String, Map<String, Integer>> cartData = getCartDataMap(user);

            cartData.putIfAbsent(itemId, new HashMap<>());
            cartData.get(itemId).put(size, quantity);

            user.setCartData(mapper.writeValueAsString(cartData));
            userRepository.save(user);

            response.put("success", true);
            response.put("message", "Cart updated");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/get")
    public Map<String, Object> getUserCart() {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = getAuthenticatedUser();
            if (user == null) throw new Exception("User not found");

            Map<String, Map<String, Integer>> cartData = getCartDataMap(user);

            response.put("success", true);
            response.put("cartData", cartData);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }
}

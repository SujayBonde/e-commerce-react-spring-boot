package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                response.put("success", false);
                response.put("message", "User already exists");
                return response;
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setCartData("{}");
            User savedUser = userRepository.save(user);
            String token = jwtUtil.generateToken(savedUser.getId());
            response.put("success", true);
            response.put("token", token);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = body.get("email");
            String password = body.get("password");

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
                String token = jwtUtil.generateToken(userOpt.get().getId());
                response.put("success", true);
                response.put("token", token);
            } else {
                response.put("success", false);
                response.put("message", "Invalid credentials");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/admin")
    public Map<String, Object> adminLogin(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = body.get("email");
            String password = body.get("password");

            if ("sujaybonde2005@gmail.com".equals(email) && "Sujay@2005".equals(password)) {
                String token = jwtUtil.generateToken("admin");
                response.put("success", true);
                response.put("token", token);
            } else {
                response.put("success", false);
                response.put("message", "Invalid admin credentials");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @GetMapping("/profile")
    public Map<String, Object> getProfile(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();
        try {
            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            String userId = jwtUtil.extractUsername(token);
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, String> userData = new HashMap<>();
                userData.put("name", user.getName());
                userData.put("email", user.getEmail());
                userData.put("id", user.getId());
                response.put("success", true);
                response.put("user", userData);
            } else {
                response.put("success", false);
                response.put("message", "User not found");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }
}


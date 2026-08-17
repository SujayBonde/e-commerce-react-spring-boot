package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    private ObjectMapper mapper = new ObjectMapper();

    private String getAuthenticatedUserId() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping("/place")
    public Map<String, Object> placeOrder(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            String userId = getAuthenticatedUserId();
            User user = userRepository.findById(userId).orElseThrow(() -> new Exception("User not found"));

            Order order = new Order();
            order.setUserId(userId);
            
            // body has "address", "items", "amount"
            order.setAddress(mapper.writeValueAsString(body.get("address")));
            order.setItems(mapper.writeValueAsString(body.get("items")));
            order.setAmount(Double.parseDouble(body.get("amount").toString()));
            order.setStatus("Order Placed");
            order.setPaymentMethod("COD");
            order.setPayment(false);
            order.setDate(new Date());

            orderRepository.save(order);

            // clear user cart
            user.setCartData("{}");
            userRepository.save(user);

            response.put("success", true);
            response.put("message", "Order placed successfully");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/stripe")
    public Map<String, Object> stripeOrder(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Stripe payments are Currently not Available");
        return response;
    }

    @PostMapping("/razorpay")
    public Map<String, Object> razorpayOrder(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Razorpay payments are Currently not Available");
        return response;
    }

    private List<Map<String, Object>> populateOrderItems(Order order) throws Exception {
        Map<String, Object> orderMap = mapper.convertValue(order, new TypeReference<Map<String, Object>>() {});
        
        List<Map<String, Object>> items = mapper.readValue(order.getItems(), new TypeReference<List<Map<String, Object>>>() {});
        
        for (Map<String, Object> item : items) {
            String productId = (String) item.get("productId");
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isPresent()) {
                item.put("productId", productOpt.get());
            } else {
                item.put("productId", null);
            }
        }
        orderMap.put("items", items);
        orderMap.put("address", mapper.readValue(order.getAddress(), new TypeReference<Map<String, Object>>() {}));
        return List.of(orderMap);
    }

    private List<Map<String, Object>> getPopulatedOrders(List<Order> orders) throws Exception {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Order order : orders) {
            result.addAll(populateOrderItems(order));
        }
        return result;
    }

    @PostMapping("/userorders")
    public Map<String, Object> userOrders() {
        Map<String, Object> response = new HashMap<>();
        try {
            String userId = getAuthenticatedUserId();
            List<Order> orders = orderRepository.findByUserId(userId);
            
            response.put("success", true);
            response.put("orders", getPopulatedOrders(orders));
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/list")
    public Map<String, Object> listOrders() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Order> orders = orderRepository.findAll();
            response.put("success", true);
            response.put("orders", getPopulatedOrders(orders));
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/status")
    public Map<String, Object> updateStatus(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            String orderId = body.get("orderId");
            String status = body.get("status");

            Order order = orderRepository.findById(orderId).orElseThrow(() -> new Exception("Order not found"));
            order.setStatus(status);
            orderRepository.save(order);

            response.put("success", true);
            response.put("message", "Status updated");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }
}

package org.bisag.jktourism.controllers;

import java.util.ArrayList;
import java.util.List;

import org.bisag.jktourism.models.RegOTP;
import org.bisag.jktourism.payload.request.DataRequest;
import org.bisag.jktourism.repository.RegOtpRepository;
import org.bisag.jktourism.services.FeedbackService;
import org.bisag.jktourism.services.RedisService;
import org.bisag.jktourism.utils.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    FeedbackService feedbackService;

    @Autowired
    RegOtpRepository regOtpRepository;

    @Autowired
    RedisService redisService;

    @PostMapping("/submit-feedback")
    public ResponseEntity<String> submitFeedback(@RequestParam String data, @RequestParam MultipartFile file)
            throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, data);
            String otp = json.has("otp") ? json.get("otp").asText() : "";
            String email = json.has("email") ? json.get("email").asText().trim() : "";

            if (email.isBlank()) {
                return ResponseEntity.ok().body(Json.serialize("Please provide email."));
            }

            if (otp.isEmpty()) {
                return ResponseEntity.badRequest().body(Json.serialize(
                        "Please enter the otp."));
            }

            String storedOtp = redisService.getValue("otp:" + email);

            if (storedOtp == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("OTP expired or not found.");
            }

            if (!storedOtp.equals(otp)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OTP");
            }

            redisService.deleteKey("otp:" + email);

            RegOTP regOtp = regOtpRepository.findByContact(email).orElse(null);

            if (regOtp == null) {
                return ResponseEntity.ok()
                        .body(Json.serialize("Please request for otp before submitting the request."));
            }

            feedbackService.saveFeedback(data, file);
            return ResponseEntity.ok(Json.serialize("Feedback submitted successfully"));
        } catch (Exception e) {
            // Handle any exceptions that may occur during feedback submission
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @PostMapping("/get-feedbacks")
    public ResponseEntity<String> getFeedbacks(@RequestBody String req) throws Exception {
        try {
            JsonNode jsonNode = Json.deserialize(JsonNode.class, req);
            int page = jsonNode.get("page").asInt(0);
            int size = jsonNode.get("size").asInt(10);

            List<Order> orders = new ArrayList<>();
            if (jsonNode.has("sort") && jsonNode.get("sort").isArray()) {
                for (JsonNode sortNode : jsonNode.get("sort")) {
                    String field = sortNode.get("field").asText();
                    String dir = sortNode.get("direction").asText("asc");
                    orders.add(new Order(Sort.Direction.fromString(dir), field));
                }
            }

            Sort sort = orders.isEmpty() ? Sort.by("name").ascending() : Sort.by(orders);

            return ResponseEntity.ok().body(Json.serialize(feedbackService.getFeedbacks(page, size, sort)));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Failed to get feedbacks");
        }
    }

    @PostMapping("/update-feedback-status")
    public ResponseEntity<String> updateFeedbackStatus(@RequestBody DataRequest request) throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, request.data());
            feedbackService.updateStatus(json.get("id").asLong());
            return ResponseEntity.ok().body(Json.serialize("Feedback status updated successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Json.serialize("Failed to get feedbacks"));
        }
    }

    @GetMapping("/get-public-feedbacks")
    public ResponseEntity<String> getPublicFeedbacks() throws Exception {
        try {
            return ResponseEntity.ok().body(Json.serialize(feedbackService.getPublicFeedbacks()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Json.serialize("Failed to get feedbacks"));
        }
    }

}

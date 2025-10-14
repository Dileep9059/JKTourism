package org.bisag.jktourism.controllers;

import java.util.HashMap;
import java.util.Map;

import org.bisag.jktourism.payload.response.UserProfileResponse;
import org.bisag.jktourism.services.UserService;
import org.bisag.jktourism.utils.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    UserService userService;

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody String request) throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, request);
            userService.changePassword(json);
            return ResponseEntity.ok(Json.serialize("Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getLocalizedMessage()));
        }
    }

    @PostMapping("/view-profile")
    public ResponseEntity<String> viewProfile(@RequestBody String request) throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, request);
            UserProfileResponse user = userService.getProfile(json);
            return ResponseEntity.ok(Json.serialize(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getLocalizedMessage()));
        }
    }

    @PostMapping("/delete-account")
    public ResponseEntity<String> deleteAccount(@RequestBody String request) throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, request);
            userService.deleteAccount(json.get("username").asText());
            Map<String, Object> res = new HashMap<>();
            res.put("status", "Success");
            res.put("message", "Account deleted sucessfully.");
            return ResponseEntity.ok().body(Json.serialize(res));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

}

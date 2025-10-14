package org.bisag.jktourism.controllers;

import org.bisag.jktourism.annotations.LogApiHit;
import org.bisag.jktourism.services.ActivityService;
import org.bisag.jktourism.utils.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    ActivityService activityService;

    @GetMapping("/slider-images")
    public ResponseEntity<String> getSliderImages() throws Exception {
        try {
            return ResponseEntity.ok(Json.serialize(activityService.getSliderImages()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @GetMapping("/activities")
    @LogApiHit(type = "activities", action = "list-activities")
    public ResponseEntity<String> getActivities() throws Exception {
        try {
            return ResponseEntity.ok(Json.serialize(activityService.fetchActivities()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @PostMapping("/get-activity-by-name")
    @LogApiHit(type = "activities", action = "detail-activity")
    public ResponseEntity<String> getActivityByName(@RequestBody String req) throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, req);
            String activityName = json.has("activityName") ? json.get("activityName").asText() : "";
            return ResponseEntity.ok(Json.serialize(activityService.getActivity(activityName)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

}

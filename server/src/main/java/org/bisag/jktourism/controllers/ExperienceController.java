package org.bisag.jktourism.controllers;

import org.bisag.jktourism.annotations.LogApiHit;
import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.services.ExperienceService;
import org.bisag.jktourism.utils.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    @Autowired
    Crypto crypto;

    @Autowired
    JdbcTemplate template;

    @Autowired
    ExperienceService experienceService;

    @GetMapping("/slider-images")
    public ResponseEntity<String> getSliderImages() throws Exception {
        try {
            return ResponseEntity.ok(Json.serialize(experienceService.getSliderImages()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @GetMapping("/get-experiences")
    @LogApiHit(type = "experience", action = "list-experiences")
    public ResponseEntity<String> getMethodName() throws Exception {
        try {
            return ResponseEntity.ok().body(Json.serialize(experienceService.fetchExperiences()));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Json.serialize(ex.getMessage()));
        }
    }

    @PostMapping("/get-experience-by-name")
    @LogApiHit(type = "experience", action = "detail-experience")
    public ResponseEntity<String> getActivityByName(@RequestBody String req) throws Exception {
        try {
            String experienceName = Json.deserialize(String.class, req);
            return ResponseEntity.ok(Json.serialize(experienceService.getExperience(experienceName)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

}

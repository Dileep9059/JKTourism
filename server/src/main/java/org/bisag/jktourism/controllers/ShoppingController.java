package org.bisag.jktourism.controllers;

import org.bisag.jktourism.annotations.LogApiHit;
import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.services.ShoppingService;
import org.bisag.jktourism.utils.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/shopping")
public class ShoppingController {

    @Autowired
    Crypto crypto;

    @Autowired
    JdbcTemplate template;

    @Autowired
    ShoppingService shoppingService;

    @GetMapping("/slider-images")
    public ResponseEntity<String> getSliderImages() throws Exception {
        try {
            return ResponseEntity.ok(Json.serialize(shoppingService.getSliderImages()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @GetMapping("/get-shopping-locations")
    @LogApiHit(type = "shopping", action = "list-shopping")
    public ResponseEntity<String> getShoppingLocations() throws Exception {
        try {
            return ResponseEntity.ok().body(Json.serialize(shoppingService.fetchShoppingLocations()));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Json.serialize(ex.getMessage()));
        }
    }

    @PostMapping("/get-shopping-location-by-name")
    // @LogApiHit(type = "shopping", action = "detail-shopping")
    public ResponseEntity<String> getShoppingLocationByName(@RequestBody String req) throws Exception {
        try {
            String locationName = Json.deserialize(String.class, req);
            return ResponseEntity.ok(Json.serialize(shoppingService.getShoppingLocation(locationName)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @PostMapping("/v2/get-shopping-location-by-name")
    @LogApiHit(type = "shopping", action = "detail-shopping")
    public ResponseEntity<String> getShoppingLocationByName_v2(@RequestBody String req) throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, req);
            String locationName = json.get("name").asText();
            return ResponseEntity.ok(Json.serialize(shoppingService.getShoppingLocation(locationName)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

}

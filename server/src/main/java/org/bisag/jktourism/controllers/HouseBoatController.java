package org.bisag.jktourism.controllers;

import java.util.ArrayList;
import java.util.List;

import org.bisag.jktourism.services.HouseBoatService;
import org.bisag.jktourism.utils.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/houseboat")
public class HouseBoatController {

    @Autowired
    HouseBoatService houseBoatService;

    @PostMapping("/get-house-boats")
    public ResponseEntity<String> getHomeStays(@RequestBody String req) {
        try {
            JsonNode jsonNode = Json.deserialize(JsonNode.class, req);
            int page = jsonNode.get("page").asInt(0);
            int size = jsonNode.get("size").asInt(10);
            String search = jsonNode.has("search") ? jsonNode.get("search").asText() : "";
            String category = jsonNode.has("category") ? jsonNode.get("category").asText() : "";
            String location = jsonNode.has("location") ? jsonNode.get("location").asText() : "";

            List<Order> orders = new ArrayList<>();
            if (jsonNode.has("sort") && jsonNode.get("sort").isArray()) {
                for (JsonNode sortNode : jsonNode.get("sort")) {
                    String field = sortNode.get("field").asText();
                    String dir = sortNode.get("direction").asText("asc");
                    orders.add(new Order(Sort.Direction.fromString(dir), field));
                }
            }

            Sort sort = orders.isEmpty() ? Sort.by("name").ascending() : Sort.by(orders);

            return ResponseEntity.ok()
                    .body(Json.serialize(houseBoatService.getHouseBoats(page, size, sort, search, category, location)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting tour guides: " + e.getMessage());
        }
    }

    @PostMapping("/get-locations")
    public ResponseEntity<String> getDistricts() {
        try {
            return ResponseEntity.ok().body(Json.serialize(houseBoatService.getLocations()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting districts: " + e.getMessage());
        }
    }

    @PostMapping("/get-categories")
    public ResponseEntity<?> getCategories(@RequestBody String req) throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, req);
            return ResponseEntity.ok()
                    .body(Json.serialize(houseBoatService.getCategories(json.get("location").asText())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

}

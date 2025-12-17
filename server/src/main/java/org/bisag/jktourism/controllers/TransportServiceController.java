package org.bisag.jktourism.controllers;

import java.util.ArrayList;
import java.util.List;

import org.bisag.jktourism.services.TransportServicesService;
import org.bisag.jktourism.utils.Json;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transport-service")
public class TransportServiceController {

    private final TransportServicesService transportServicesService;

    @PostMapping("/get-districts")
    public ResponseEntity<String> getDistricts(@RequestBody String req) {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, req);
            return ResponseEntity.ok().body(Json
                    .serialize(transportServicesService.getDistricts(json.get("state").asText())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting districts: " + e.getMessage());
        }
    }

    @PostMapping("/get-services")
    public ResponseEntity<String> getTourGuides(@RequestBody String req) {
        try {
            JsonNode jsonNode = Json.deserialize(JsonNode.class, req);
            int page = jsonNode.get("page").asInt(0);
            int size = jsonNode.get("size").asInt(10);
            String search = jsonNode.has("search") ? jsonNode.get("search").asText() : "";
            String state = jsonNode.has("state") ? jsonNode.get("state").asText() : "";
            String district = jsonNode.has("district") ? jsonNode.get("district").asText() : "";

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
                    .body(Json.serialize(transportServicesService.getGuides(page, size, sort, search, state, district)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting tour guides: " + e.getMessage());
        }
    }
}

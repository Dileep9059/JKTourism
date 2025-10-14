package org.bisag.jktourism.controllers;

import java.util.HashMap;
import java.util.Map;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.services.EventService;
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
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    EventService eventService;

    @Autowired
    Crypto crypto;

    @GetMapping("/all")
    public ResponseEntity<String> fetchEvents() {
        try {
            return ResponseEntity.ok().body(Json.serialize(eventService.fetchAll().stream().map(row -> {
                try {
                    Map<String, Object> temp = new HashMap<>();
                    temp.put("id", Json.serialize(Map.of("id", row.getId())));
                    temp.put("title", row.getTitle());
                    temp.put("image", row.getImage());
                    temp.put("startDate", row.getStartDate());
                    return temp;
                } catch (Exception ex) {
                    return null;
                }
            }).toList()));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/get-event")
    public ResponseEntity<String> getEvent(@RequestBody String data) {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, data);
            Long id = json.get("id").asLong();
            return ResponseEntity.ok().body(Json.serialize(eventService.getEvent(id)));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Event not found.");
        }

    }

}

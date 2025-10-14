package org.bisag.jktourism.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bisag.jktourism.utils.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/amenities")
public class AmenitiesController {

        @Autowired
        JdbcTemplate template;

        @PostMapping("/all")
        public ResponseEntity<String> getAllAmenities(@RequestBody String data) throws Exception {
                JsonNode json = Json.deserialize(JsonNode.class, data);

                String state = json.has("state") ? json.get("state").asText() : "Jammu And Kashmir";
                String district = json.has("district")
                                ? (json.get("district").asText().equals("default") ? "" : json.get("district").asText())
                                : "";
                List<Map<String, Object>> transport = state.equals("Jammu And Kashmir") ? template.queryForList(
                                "SELECT name, district, latitude, longitude FROM public.transport_amenities where type = 'Transport' order by name")
                                : district.equals("") ? template.queryForList(
                                                "SELECT name, district, latitude, longitude FROM public.transport_amenities where type = 'Transport' and statename=? order by name",
                                                state)
                                                : template.queryForList(
                                                                "SELECT name, district, latitude, longitude FROM public.transport_amenities where type = 'Transport' and statename=? and district = ? order by name",
                                                                state, district);

                List<Map<String, Object>> amenities = state.equals("Jammu And Kashmir") ? template.queryForList(
                                "SELECT name, district, latitude, longitude FROM public.transport_amenities where type = 'Ammenities' order by name")
                                : district.equals("") ? template.queryForList(
                                                "SELECT name, district, latitude, longitude FROM public.transport_amenities where type = 'Ammenities' and statename = ? order by name",
                                                state)
                                                : template.queryForList(
                                                                "SELECT name, district, latitude, longitude FROM public.transport_amenities where type = 'Ammenities' and statename = ? and district = ? order by name",
                                                                state, district);

                List<Map<String, Object>> health = state.equals("Jammu And Kashmir") ? template.queryForList(
                                "SELECT name, district, latitude, longitude FROM public.transport_amenities where type = 'Health' order by name")
                                : district.equals("") ? template.queryForList(
                                                "SELECT name, district, latitude, longitude FROM public.transport_amenities where type = 'Health' and statename = ?  order by name",
                                                state)
                                                : template.queryForList(
                                                                "SELECT name, district, latitude, longitude FROM public.transport_amenities where type = 'Health' and statename = ? and district = ? order by name",
                                                                state, district);

                Map<String, Object> result = new HashMap<>();
                result.put("transport", transport);
                result.put("amenities", amenities);
                result.put("health", health);
                return ResponseEntity.ok().body(Json.serialize(result));
        }

}

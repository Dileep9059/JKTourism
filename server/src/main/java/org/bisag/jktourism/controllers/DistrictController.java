package org.bisag.jktourism.controllers;

import java.util.List;

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
@RequestMapping("/api/ut/")
public class DistrictController {

    @Autowired
    JdbcTemplate template;

    @PostMapping("/getDistricts")
    public ResponseEntity<String> getDistricts(@RequestBody String data) throws Exception {

        JsonNode json = Json.deserialize(JsonNode.class, data);
        String state = json.has("state") ? json.get("state").asText() : "Jammu And Kashmir";
        List<String> result = state.equals("Jammu And Kashmir")
                ? template.queryForList("SELECT name11 as name FROM jkt_district_master order by name asc",
                        String.class)
                : template.queryForList(
                        "SELECT name11 as name FROM jkt_district_master where division_name = ? order by name asc",
                        String.class, state.toUpperCase());

        return ResponseEntity.ok().body(Json.serialize(result));
    }

}

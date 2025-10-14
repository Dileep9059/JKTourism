package org.bisag.jktourism.controllers;

import org.bisag.jktourism.annotations.LogApiHit;
import org.bisag.jktourism.services.DestinationService;
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
@RequestMapping("/api/destination")
public class DestinationController {

    @Autowired
    DestinationService destinationService;

    @PostMapping("/getDestinationByCategory")
    @LogApiHit(type = "category", action = "list-destinations")
    public ResponseEntity<String> getDestinationByCategory(@RequestBody String d) throws Exception {
        JsonNode json = Json.deserialize(JsonNode.class, d);
        return ResponseEntity.ok()
                .body(Json
                        .serialize(destinationService.getAllDestinationByCategory(json.get("categoryName").asText())));
    }

    @PostMapping("/getDetailsByDestination")
    @LogApiHit(type = "category", action = "detail-destination")
    public ResponseEntity<String> getDetailsByDestination(@RequestBody String d) throws Exception {
        try {

            JsonNode json = Json.deserialize(JsonNode.class, d);
            return ResponseEntity.ok()
                    .body(Json.serialize(destinationService.getdestinationDetails(json.get("placeName").asText())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @GetMapping("/get-destinations-groupby-category")
    public ResponseEntity<String> getDestinationGroupByCategory() throws Exception {
        try {
            return ResponseEntity.ok().body(Json.serialize(destinationService.getDestinationsGroupByCategory()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Json.serialize("Unable to get destinations"));
        }
    }

    // ALBUM
    @PostMapping("/get-album-by-destination")
    public ResponseEntity<String> getAlbumByDestination(@RequestBody String request) throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, request);
            String destinationUrlValue = json.get("urlValue").asText();
            return ResponseEntity.ok()
                    .body(Json.serialize(destinationService.getAlbumByDestination(destinationUrlValue)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Json.serialize("Unable to get album"));
        }
    }

}

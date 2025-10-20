package org.bisag.jktourism.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.models.Activity;
import org.bisag.jktourism.models.Cuisine;
import org.bisag.jktourism.models.Event;
import org.bisag.jktourism.models.Experience;
import org.bisag.jktourism.models.Shopping;
import org.bisag.jktourism.payload.request.EncryptedRequest;
import org.bisag.jktourism.payload.response.MessageResponse;
import org.bisag.jktourism.services.ActivityService;
import org.bisag.jktourism.services.CuisineService;
import org.bisag.jktourism.services.DestinationCategoryService;
import org.bisag.jktourism.services.DestinationService;
import org.bisag.jktourism.services.EventService;
import org.bisag.jktourism.services.ExperienceService;
import org.bisag.jktourism.services.ShoppingService;
import org.bisag.jktourism.services.WhyVisitService;
import org.bisag.jktourism.utils.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    Crypto crypto;

    @Autowired
    JdbcTemplate template;

    @Autowired
    DestinationCategoryService categoryService;

    @Autowired
    WhyVisitService whyVisitService;

    @Autowired
    DestinationService destinationService;

    @Autowired
    EventService eventService;

    @Autowired
    ActivityService activityService;

    @Autowired
    ExperienceService experienceService;

    @Autowired
    ShoppingService shoppingService;

    @Autowired
    CuisineService cuisineService;

    @PostMapping("/add-category")
    public MessageResponse addCategory(@RequestParam String data,
            @RequestParam MultipartFile file) throws Exception {
        try {
            String category = Json.deserialize(String.class, data);
            // remove any leading or trailing whitespace and replace multiple spaces with a
            // single space
            categoryService.addCategory(capitalizeWords(category.trim().replaceAll("\\s+", " ")), file);
        } catch (IllegalArgumentException e) {
            return new MessageResponse(e.getLocalizedMessage());
        } catch (Exception e) {
            return new MessageResponse("Error adding category: " + e.getLocalizedMessage());
        }
        return new MessageResponse("Category added successfully.");
    }

    public static String capitalizeWords(String input) {
        if (input == null || input.isEmpty())
            return input;

        String[] words = input.trim().split("\\s+");
        StringBuilder capitalized = new StringBuilder();

        for (String word : words) {
            if (word.length() > 0) {
                capitalized.append(Character.toUpperCase(word.charAt(0)));
                if (word.length() > 1) {
                    capitalized.append(word.substring(1).toLowerCase());
                }
                capitalized.append(" ");
            }
        }

        return capitalized.toString().trim();
    }

    @PostMapping("/get-categories")
    public ResponseEntity<String> getCategories(@RequestBody String req) throws Exception {
        try {
            JsonNode jsonNode = Json.deserialize(JsonNode.class, req);
            int page = jsonNode.get("page").asInt(0);
            int size = jsonNode.get("size").asInt(10);

            List<Order> orders = new ArrayList<>();
            if (jsonNode.has("sort") && jsonNode.get("sort").isArray()) {
                for (JsonNode sortNode : jsonNode.get("sort")) {
                    String field = sortNode.get("field").asText();
                    String dir = sortNode.get("direction").asText("asc");
                    orders.add(new Order(Sort.Direction.fromString(dir), field));
                }
            }

            Sort sort = orders.isEmpty() ? Sort.by("name").ascending() : Sort.by(orders);

            return ResponseEntity.ok().body(Json.serialize(categoryService.getCategories(page, size, sort)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting categories: " + e.getMessage());
        }
    }

    @PostMapping("/add-destination")
    public MessageResponse adddestination(@RequestParam String data, @RequestParam MultipartFile[] files,
            @RequestParam Map<String, String> metadata)
            throws Exception {

        try {
            JsonNode destination = Json.deserialize(JsonNode.class, data);

            destinationService.addDestination(destination, metadata, files);
        } catch (IllegalArgumentException e) {

            return new MessageResponse(e.getLocalizedMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return new MessageResponse("Error adding Destination");
        }
        return new MessageResponse("Destination added successfully.");
    }

    @PostMapping("/update-category-status")
    public MessageResponse updateCategoryVisById(@RequestParam String data) throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, data);
            categoryService.updateCategory(json.get("id").asLong());
        } catch (Exception e) {
            e.printStackTrace();
            return new MessageResponse("Error updating category status: " + e.getLocalizedMessage());
        }
        return new MessageResponse("Category Status Updated Successfully.");
    }

    @PostMapping("/get-destinations")
    public ResponseEntity<String> getdestinations(@RequestBody EncryptedRequest req) throws Exception {
        try {
            JsonNode jsonNode = Json.deserialize(JsonNode.class, req.data());
            int page = jsonNode.get("page").asInt(0);
            int size = jsonNode.get("size").asInt(10);

            List<Order> orders = new ArrayList<>();
            if (jsonNode.has("sort") && jsonNode.get("sort").isArray()) {
                for (JsonNode sortNode : jsonNode.get("sort")) {
                    String field = sortNode.get("field").asText();
                    String dir = sortNode.get("direction").asText("asc");
                    orders.add(new Order(Sort.Direction.fromString(dir), field));
                }
            }

            Sort sort = orders.isEmpty() ? Sort.by("name").ascending() : Sort.by(orders);

            return ResponseEntity.ok().body(Json.serialize(destinationService.getDestinations(page, size, sort)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting categories: " + e.getMessage());
        }
    }

    @PostMapping("/add-event")
    public ResponseEntity<String> addEvent(@RequestParam String data,
            @RequestParam MultipartFile file) throws Exception {

        try {
            Event event = Json.deserialize(Event.class, data);
            eventService.createEvent(event, file);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error parsing event data: " + e.getMessage());
        }
        return ResponseEntity.ok().body(Json.serialize("Event added successfully."));
    }

    @PostMapping("/get-events")
    public ResponseEntity<String> getEvents(@RequestBody EncryptedRequest req) throws Exception {
        try {
            JsonNode jsonNode = Json.deserialize(JsonNode.class, req.data());
            int page = jsonNode.get("page").asInt(0);
            int size = jsonNode.get("size").asInt(10);

            List<Order> orders = new ArrayList<>();
            if (jsonNode.has("sort") && jsonNode.get("sort").isArray()) {
                for (JsonNode sortNode : jsonNode.get("sort")) {
                    String field = sortNode.get("field").asText();
                    String dir = sortNode.get("direction").asText("asc");
                    orders.add(new Order(Sort.Direction.fromString(dir), field));
                }
            }

            Sort sort = orders.isEmpty() ? Sort.by("name").ascending() : Sort.by(orders);

            return ResponseEntity.ok().body(Json.serialize(eventService.getEvents(page, size, sort)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting categories: " + e.getMessage());
        }
    }

    @PostMapping("/update-event-status")
    public MessageResponse updateEventVisById(@RequestParam String data) throws Exception {
        try {
            JsonNode req = Json.deserialize(JsonNode.class, data);
            eventService.updateEvent(req.get("id").asLong(), req.get("isApproved").asBoolean());
        } catch (Exception e) {
            e.printStackTrace();
            return new MessageResponse("Error updating event status: " + e.getLocalizedMessage());
        }
        return new MessageResponse("Event Status Updated Successfully.");
    }

    @PostMapping("/add-activity")
    public ResponseEntity<String> addActivity(@RequestParam String data,
            @RequestParam MultipartFile[] files) throws Exception {
        try {
            Activity activity = Json.deserialize(Activity.class, data);
            activityService.createActivity(activity, files);
            return ResponseEntity.ok().body(Json.serialize("Activity added successfully."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error");
        }
    }

    @PostMapping("/get-activities")
    public ResponseEntity<String> getActivities(@RequestBody EncryptedRequest req) throws Exception {
        try {
            JsonNode jsonNode = Json.deserialize(JsonNode.class, req.data());
            int page = jsonNode.get("page").asInt(0);
            int size = jsonNode.get("size").asInt(10);

            List<Order> orders = new ArrayList<>();
            if (jsonNode.has("sort") && jsonNode.get("sort").isArray()) {
                for (JsonNode sortNode : jsonNode.get("sort")) {
                    String field = sortNode.get("field").asText();
                    String dir = sortNode.get("direction").asText("asc");
                    orders.add(new Order(Sort.Direction.fromString(dir), field));
                }
            }

            Sort sort = orders.isEmpty() ? Sort.by("name").ascending() : Sort.by(orders);

            return ResponseEntity.ok().body(Json.serialize(activityService.getActivities(page, size, sort)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting categories: " + e.getMessage());
        }
    }

    @PostMapping("/update-activity-status")
    public MessageResponse updateActivityStatus(@RequestParam String data) throws Exception {
        try {
            JsonNode req = Json.deserialize(JsonNode.class, data);
            activityService.updateStatus(req.get("id").asLong());
        } catch (Exception e) {
            e.printStackTrace();
            return new MessageResponse("Error updating category status: " + e.getLocalizedMessage());
        }
        return new MessageResponse("Activity Status Updated Successfully.");
    }

    @PostMapping("/add-experience")
    public ResponseEntity<String> addExperience(@RequestParam String data,
            @RequestParam MultipartFile[] files) throws Exception {
        try {
            Experience experience = Json.deserialize(Experience.class, data);
            experienceService.createExperience(experience, files);
            return ResponseEntity.ok().body(Json.serialize("Experience added successfully."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Json.serialize("Some error occurred. Please try again later."));
        }
    }

    @PostMapping("/get-experiences")
    public ResponseEntity<String> getExperiences(@RequestBody EncryptedRequest req) throws Exception {
        try {
            JsonNode jsonNode = Json.deserialize(JsonNode.class, req.data());
            int page = jsonNode.get("page").asInt(0);
            int size = jsonNode.get("size").asInt(10);

            List<Order> orders = new ArrayList<>();
            if (jsonNode.has("sort") && jsonNode.get("sort").isArray()) {
                for (JsonNode sortNode : jsonNode.get("sort")) {
                    String field = sortNode.get("field").asText();
                    String dir = sortNode.get("direction").asText("asc");
                    orders.add(new Order(Sort.Direction.fromString(dir), field));
                }
            }

            Sort sort = orders.isEmpty() ? Sort.by("name").ascending() : Sort.by(orders);

            return ResponseEntity.ok().body(Json.serialize(experienceService.getExperiences(page, size, sort)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting experiences: " + e.getMessage());
        }
    }

    @PostMapping("/update-experience-status")
    public MessageResponse updateExperienceStatus(@RequestParam String data) throws Exception {
        try {
            JsonNode req = Json.deserialize(JsonNode.class, data);
            experienceService.updateStatus(req.get("id").asLong());
        } catch (Exception e) {
            e.printStackTrace();
            return new MessageResponse("Error updating category status: " + e.getLocalizedMessage());
        }
        return new MessageResponse("Experience Status Updated Successfully.");
    }

    @PostMapping("/add-shopping")
    public ResponseEntity<String> addShopping(@RequestParam String data,
            @RequestParam MultipartFile[] files) throws Exception {
        try {
            Shopping shopping = Json.deserialize(Shopping.class, data);
            shoppingService.createShopping(shopping, files);
            return ResponseEntity.ok().body(Json.serialize("Shopping added successfully."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Json.serialize("Some error occurred. Please try again later."));
        }
    }

    @PostMapping("/get-all-shopping")
    public ResponseEntity<String> getAllShopping(@RequestBody EncryptedRequest req) throws Exception {
        try {
            JsonNode jsonNode = Json.deserialize(JsonNode.class, req.data());
            int page = jsonNode.get("page").asInt(0);
            int size = jsonNode.get("size").asInt(10);

            List<Order> orders = new ArrayList<>();
            if (jsonNode.has("sort") && jsonNode.get("sort").isArray()) {
                for (JsonNode sortNode : jsonNode.get("sort")) {
                    String field = sortNode.get("field").asText();
                    String dir = sortNode.get("direction").asText("asc");
                    orders.add(new Order(Sort.Direction.fromString(dir), field));
                }
            }

            Sort sort = orders.isEmpty() ? Sort.by("name").ascending() : Sort.by(orders);

            return ResponseEntity.ok().body(Json.serialize(shoppingService.getAllShopping(page, size, sort)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting experiences: " + e.getMessage());
        }
    }

    @PostMapping("/update-shopping-status")
    public MessageResponse updateShoppingStatus(@RequestParam String data) throws Exception {
        try {
            JsonNode req = Json.deserialize(JsonNode.class, data);
            shoppingService.updateStatus(req.get("id").asLong());
        } catch (Exception e) {
            return new MessageResponse("Error updating category status: " + e.getLocalizedMessage());
        }
        return new MessageResponse("Shopping Location Status Updated Successfully.");
    }

    @PostMapping("/upload-files")
    public ResponseEntity<String> uploadFiles(@RequestParam(required = false) MultipartFile[] images,
            @RequestParam(required = false) MultipartFile[] videos,
            @RequestParam(required = false) MultipartFile[] brochures, @RequestParam String data)
            throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, data);
            destinationService.uploadDestinationData(json, images, videos, brochures);
            return ResponseEntity.ok().body(Json.serialize("Okay."));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Json.serialize("Some error occurred. Please try again later."));
        }
    }

    @PostMapping("/upload-activity-files")
    public ResponseEntity<String> uploadActivityFiles(@RequestParam(required = false) MultipartFile[] images,
            @RequestParam(required = false) MultipartFile[] videos,
            @RequestParam(required = false) MultipartFile[] brochures, @RequestParam String data)
            throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, data);
            destinationService.uploadActivityData(json, images, videos, brochures);
            return ResponseEntity.ok().body(Json.serialize("Files uploaded successfully."));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Json.serialize(ex.getMessage()));
        }
    }

    // CUISINES
    @PostMapping("/add-cuisine")
    public ResponseEntity<String> addCuisine(@RequestParam String data,
            @RequestParam MultipartFile[] files) throws Exception {
        try {
            Cuisine cuisine = Json.deserialize(Cuisine.class, data);
            cuisineService.createCuisine(cuisine, files);
            return ResponseEntity.ok().body(Json.serialize("Cuisine added successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @PostMapping("/get-cuisines")
    public ResponseEntity<String> getCuisines(@RequestBody EncryptedRequest req) throws Exception {
        try {
            JsonNode jsonNode = Json.deserialize(JsonNode.class, req.data());
            int page = jsonNode.get("page").asInt(0);
            int size = jsonNode.get("size").asInt(10);

            List<Order> orders = new ArrayList<>();
            if (jsonNode.has("sort") && jsonNode.get("sort").isArray()) {
                for (JsonNode sortNode : jsonNode.get("sort")) {
                    String field = sortNode.get("field").asText();
                    String dir = sortNode.get("direction").asText("asc");
                    orders.add(new Order(Sort.Direction.fromString(dir), field));
                }
            }

            Sort sort = orders.isEmpty() ? Sort.by("name").ascending() : Sort.by(orders);

            return ResponseEntity.ok().body(Json.serialize(cuisineService.getCuisines(page, size, sort)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting cuisines: " + e.getMessage());
        }
    }

    @PostMapping("/update-cuisine-status")
    public MessageResponse updateCuisinesStatus(@RequestParam String data) throws Exception {
        try {
            JsonNode req = Json.deserialize(JsonNode.class, data);
            cuisineService.updateStatus(req.get("id").asLong());
        } catch (Exception e) {
            e.printStackTrace();
            return new MessageResponse("Error updating category status: " + e.getLocalizedMessage());
        }
        return new MessageResponse("Cuisine Status Updated Successfully.");
    }
}

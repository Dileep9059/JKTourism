package org.bisag.jktourism.controllers;

import java.io.File;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.models.StaticData;
import org.bisag.jktourism.repository.StaticDataRepository;
import org.bisag.jktourism.utils.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@RestController
@RequestMapping("/api/common")
public class CommonController {

        String baseUrl = "https://staging2.pmgatishakti.gov.in";

        @Value("${backendPath}")
        String backendPath;

        @Value("${mediaPath}")
        String mediaPath;

        @Autowired
        Crypto crypto;

        @Autowired
        StaticDataRepository staticDataRepository;

        @GetMapping("/get-dashboard-data")
        public ResponseEntity<String> getDashboardContent() throws Exception {
                try {
                        StaticData staticData = staticDataRepository.findByKey("LandingPageData");
                        ObjectMapper mapper = new ObjectMapper();
                        return ResponseEntity.ok(Json.serialize(mapper.readTree(staticData.getValue())));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body("Error");
                }
        }

        @GetMapping("/generate-dashboard-data")
        public ResponseEntity<String> generateDashboardContent() throws Exception {
                try {
                        List<Object> dashboardData = new ArrayList<>();

                        dashboardData.add(createSectionCard("0",
                                        mediaPath + File.separator + "landingdata" + File.separator + "banner-02.jpg",
                                        "4db100",
                                        "Most Visited Destinations"));
                        dashboardData
                                        .add(createSectionCard("1",
                                                        mediaPath + File.separator + "landingdata" + File.separator
                                                                        + "banner-03.png",
                                                        "0c48ff",
                                                        "Upcoming Events"));
                        dashboardData.add(
                                        createSectionCard("2",
                                                        mediaPath + File.separator + "landingdata" + File.separator
                                                                        + "banner-04.jpg",
                                                        "ff0c10",
                                                        "Experiences of J&K"));
                        dashboardData.add(createSectionCard("3",
                                        mediaPath + File.separator + "landingdata" + File.separator + "banner-05.png",
                                        "8700a8",
                                        "Gallery"));

                        return ResponseEntity.ok(Json.serialize(dashboardData));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body("Error");
                }
        }

        @GetMapping("/get-hamburger-data")
        public ResponseEntity<String> getHamburgerData() {
                try {
                        StaticData staticData = staticDataRepository.findByKey("HamburgerData");
                        ObjectMapper mapper = new ObjectMapper();

                        return ResponseEntity.ok(Json.serialize(mapper.readTree(staticData.getValue())));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body("Error");
                }
        }

        @GetMapping("/generate-hamburger-data")
        public ResponseEntity<String> generateHamburgerData() {
                try {
                        List<Object> hanburgerData = new ArrayList<>();
                        // Section 1: What to do
                        Map<String, Object> whatToDo = new HashMap<>();
                        whatToDo.put("title", "What to do");

                        List<Map<String, String>> whatToDoItems = Arrays.asList(
                                        createItem("Trekking", "/activities/Trekking"),
                                        createItem("Skiing", "/activities/Skiing"),
                                        createItem("Paragliding", "/activities/Paragliding"),
                                        createItem("Hot Air Balloon", "/activities/HotAirBalloon"));
                        whatToDo.put("items", whatToDoItems);
                        hanburgerData.add(whatToDo);

                        // Section 2: Plan Your Trip
                        Map<String, Object> planTrip = new HashMap<>();
                        planTrip.put("title", "Plan Your Trip");

                        List<Map<String, String>> planTripItems = Arrays.asList(
                                        createItem("How to Reach JK", "/plan-trip"),
                                        createItem("Registered Travel Operators of JK", "/travel-agent"),
                                        createItem("Registered Travel Guides", "/tour-guide"),
                                        createItem("Registered Home Stays", "/homestays"),
                                        createItem("How to Spend 3 days in Kashmir / Jammu", "/plan-trip?days=3-days"),
                                        createItem("How to Spend 4 days in Kashmir / Jammu", "/plan-trip?days=4-days"),
                                        createItem("How to Spend 5 days in Kashmir / Jammu", "/plan-trip?days=5-days"),
                                        createItem("How to Spend 6 days in Kashmir / Jammu", "/plan-trip?days=6-days"),
                                        createItem("How to Spend 7 days in Kashmir / Jammu", "/plan-trip?days=7-days"));
                        planTrip.put("items", planTripItems);
                        hanburgerData.add(planTrip);

                        // Section 3: Shopping
                        Map<String, Object> shopping = new HashMap<>();
                        shopping.put("title", "Shopping");

                        List<Map<String, String>> shoppingItems = Arrays.asList(
                                        createItem("Poloview", "/shopping/PoloView"),
                                        createItem("Lal Chowk", "/shopping/LalChowk"));
                        shopping.put("items", shoppingItems);
                        hanburgerData.add(shopping);

                        // Section 4: where to stay
                        Map<String, Object> whereToStay = new HashMap<>();
                        whereToStay.put("title", "Where to Stay");

                        List<Map<String, String>> whereToStayItems = Arrays.asList(
                                        Map.of("title", "JKTDC", "url", "https://www.jktdc.co.in/"));
                        whereToStay.put("items", whereToStayItems);
                        hanburgerData.add(whereToStay);

                        // Section 5: QUICK LINKS
                        Map<String, Object> quickLinks = new HashMap<>();
                        quickLinks.put("title", "QUICK LINKS");

                        List<Map<String, String>> links = Arrays.asList(
                                        createLink("Travel Facilities", "/amenities"),
                                        createLink("Medical Facilities", "/amenities"),
                                        createLink("Wayside Amenities", "/amenities"),
                                        createLink("Contact us", "/contact-us"));
                        quickLinks.put("links", links);
                        hanburgerData.add(quickLinks);

                        StaticData staticData = staticDataRepository.findByKey("HamburgerData");

                        ObjectMapper mapper = new ObjectMapper();

                        // return ResponseEntity.ok(Json.serialize(hanburgerData));
                        return ResponseEntity.ok(Json.serialize(mapper.readTree(staticData.getValue())));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body("Error");
                }
        }

        private Map<String, String> createItem(String title, String url) {
                Map<String, String> map = new HashMap<>();
                map.put("title", title);
                map.put("url", baseUrl + url);
                return map;
        }

        private Map<String, String> createLink(String label, String href) {
                Map<String, String> map = new HashMap<>();
                map.put("label", label);
                map.put("href", baseUrl + href);
                return map;
        }

        private Map<String, String> createSectionCard(String order, String imageUrl, String color, String title)
                        throws Exception {
                Map<String, String> map = new HashMap<>();
                map.put("display_order", order);
                map.put("image_url",
                                backendPath + "/files/load-file-by-path?path="
                                                + URLEncoder.encode(crypto.encrypt(imageUrl), "UTF-8"));
                map.put("color", color);
                map.put("title", title);
                return map;
        }

        @GetMapping("/get-social-media-images")
        public ResponseEntity<String> getSocialMedia() throws Exception {
                try {
                        List<Object> socialMedia = new ArrayList<>();

                        Map<String, String> facebook = new HashMap<>();
                        facebook.put("title", "Facebook");
                        facebook.put("image_url",
                                        backendPath + "/files/load-file-by-path?path="
                                                        + URLEncoder.encode(crypto.encrypt(
                                                                        mediaPath + File.separator + "socialmedia"
                                                                                        + File.separator
                                                                                        + "facebookbg_.png"),
                                                                        "UTF-8"));
                        facebook.put("icon",
                                        backendPath + "/files/load-file-by-path?path="
                                                        + URLEncoder.encode(crypto.encrypt(
                                                                        mediaPath + File.separator + "socialmedia"
                                                                                        + File.separator
                                                                                        + "facebook.png"),
                                                                        "UTF-8"));

                        Map<String, String> instagram = new HashMap<>();
                        instagram.put("title", "Instagram");
                        instagram.put("image_url",
                                        backendPath + "/files/load-file-by-path?path="
                                                        + URLEncoder.encode(crypto.encrypt(
                                                                        mediaPath + File.separator + "socialmedia"
                                                                                        + File.separator
                                                                                        + "instagrambg_.png"),
                                                                        "UTF-8"));
                        instagram.put("icon",
                                        backendPath + "/files/load-file-by-path?path="
                                                        + URLEncoder.encode(crypto.encrypt(
                                                                        mediaPath + File.separator + "socialmedia"
                                                                                        + File.separator
                                                                                        + "instagram_.png"),
                                                                        "UTF-8"));

                        Map<String, String> twitter = new HashMap<>();
                        twitter.put("title", "Twitter");
                        twitter.put("image_url",
                                        backendPath + "/files/load-file-by-path?path="
                                                        + URLEncoder.encode(crypto.encrypt(
                                                                        mediaPath + File.separator + "socialmedia"
                                                                                        + File.separator
                                                                                        + "twitterbg_.png"),
                                                                        "UTF-8"));
                        twitter.put("icon", backendPath + "/files/load-file-by-path?path="
                                        + URLEncoder.encode(
                                                        crypto.encrypt(mediaPath + File.separator + "socialmedia"
                                                                        + File.separator + "twitter.png"),
                                                        "UTF-8"));

                        socialMedia.add(facebook);
                        socialMedia.add(instagram);
                        socialMedia.add(twitter);

                        return ResponseEntity.ok(Json.serialize(socialMedia));
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(Json.serialize("Social Media images not found"));
                }
        }

        @PostMapping("/get-static-data")
        public ResponseEntity<?> getStaticData(@RequestBody String req) throws Exception {
                try {
                        JsonNode json = Json.deserialize(JsonNode.class, req);
                        String key = json.has("key") ? json.get("key").asText() : "";

                        if (key.isEmpty()) {
                                return ResponseEntity.badRequest()
                                                .body(Json.serialize("Required parameter not provided."));
                        }
                        StaticData staticData = staticDataRepository.findByKey(key);

                        if (staticData == null) {
                                return ResponseEntity.badRequest()
                                                .body(Json.serialize("Data not found for recieved parameter."));
                        }
                        ObjectMapper mapper = new ObjectMapper();
                        if (!isJson(staticData.getValue())) {
                                ObjectNode response = mapper.createObjectNode();
                                response.put("data", staticData.getValue());
                                return ResponseEntity.ok().body(Json.serialize(response));
                        }
                        return ResponseEntity.ok().body(Json.serialize(mapper.readTree(staticData.getValue())));
                } catch (Exception ex) {
                        return ResponseEntity.badRequest().body(Json.serialize("Invalid recieved parameter."));
                }
        }

        private boolean isJson(String value) {
                try {
                        final ObjectMapper mapper = new ObjectMapper();
                        mapper.readTree(value); // will throw exception if not valid JSON
                        return true;
                } catch (Exception e) {
                        return false;
                }
        }

}

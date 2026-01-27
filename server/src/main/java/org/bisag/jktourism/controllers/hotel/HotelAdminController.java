package org.bisag.jktourism.controllers.hotel;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.bisag.jktourism.models.User;
import org.bisag.jktourism.models.hotel.Hotel;
import org.bisag.jktourism.models.hotel.HotelBasicInfo;
import org.bisag.jktourism.models.hotel.HotelLocation;
import org.bisag.jktourism.models.hotel.HotelNodalOffice;
import org.bisag.jktourism.models.hotel.enums.HotelStatus;
import org.bisag.jktourism.repository.UserRepository;
import org.bisag.jktourism.repository.hotel.HotelBasicInfoRepository;
import org.bisag.jktourism.repository.hotel.HotelLocationRepository;
import org.bisag.jktourism.repository.hotel.HotelNodalOfficeRepository;
import org.bisag.jktourism.repository.hotel.HotelRepository;
import org.bisag.jktourism.utils.Json;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelAdminController {

    private final HotelRepository hotelRepo;
    private final HotelBasicInfoRepository basicInfoRepo;
    private final HotelLocationRepository hotelLocationRepo;
    private final HotelNodalOfficeRepository hotelNodalOfficeRepo;
    private final UserRepository userRepository;

    // basic info
    // /{id}/basic-info

    @PostMapping("/basic-info")
    public ResponseEntity<?> basicInfo(@RequestBody String request, Principal principal) throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, request);

            String legalName = json.get("legalName").asText();
            String displayName = json.get("displayName").asText();

            int starCategory = Integer.parseInt(json.get("starRating").asText());
            String website = json.get("websiteUrl").asText();
            String publicEmail = json.get("publicEmail").asText();
            String publicPhone = json.get("publicPhone").asText();

            String hotelType = json.get("hotelType").asText();
            int establishedYear = Integer.parseInt(json.get("yearOfEstablishment").asText());

            Hotel h = new Hotel();
            h.setStatus(HotelStatus.DRAFT);
            h.setLegalName(legalName);
            h.setDisplayName(displayName);

            System.out.println(principal.getName());
            User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user == null) {
                throw new Exception("User Not Found.");
            }
            h.setOwnerUserId(UUID.fromString(user.getUuid()));

            Hotel hotel = hotelRepo.save(h);

            HotelBasicInfo info = basicInfoRepo.findByHotelId(hotel.getId())
                    .orElse(new HotelBasicInfo(hotel));

            info.setHotelType(hotelType);
            info.setStarRating(starCategory);
            info.setEstablishedYear(establishedYear);
            info.setWebsiteUrl(website);
            info.setPublicEmail(publicEmail);
            info.setPublicPhone(publicPhone);

            basicInfoRepo.save(info);

            Map<String, Object> response = new HashMap<>();
            response.put("data", hotel.getId());
            response.put("message", "Basic Information Added Successfully.");

            return ResponseEntity.ok().body(Json.serialize(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    // location-details
    // /{id}/location

    @PostMapping("/{id}/location")
    public ResponseEntity<?> locationDetails(@PathVariable String id, @RequestBody String request) throws Exception {
        try {
            Hotel hotel = hotelRepo.findById(UUID.fromString(id)).orElse(null);
            if (hotel == null) {
                throw new Exception("Hotel Not Found.");
            }

            JsonNode json = Json.deserialize(JsonNode.class, request);
            String addressLine1 = json.get("addressLine1").asText();
            String addressLine2 = json.get("addressLine2").asText();
            String city = json.get("city").asText();
            String district = json.get("district").asText();
            String state = json.get("state").asText();
            String pincode = json.get("pincode").asText();

            Double latitude = json.get("latitude").asDouble();
            Double longitude = json.get("longitude").asDouble();

            String landmark = json.get("nearestLandmark").asText();
            String googleMapsUrl = json.get("googleMapsLink").asText();

            HotelLocation location = hotelLocationRepo.findByHotelId(hotel.getId()).orElse(new HotelLocation(hotel));

            location.setAddressLine1(addressLine1);
            location.setAddressLine2(addressLine2);
            location.setCity(city);
            location.setDistrict(district);
            location.setState(state);
            location.setPincode(pincode);
            location.setLatitude(latitude);
            location.setLongitude(longitude);
            location.setLandmark(landmark);
            location.setGoogleMapsUrl(googleMapsUrl);

            hotelLocationRepo.save(location);

            return ResponseEntity.ok().body(Json.serialize("Location Details Added Successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    // owner-details
    // /{id}/owner

    @PostMapping("/{id}/owner")
    public ResponseEntity<?> ownerDetails(@RequestBody String request) {
        try {
            return ResponseEntity.ok().body(null);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // nodal-details
    // /{id}/nodal-officer

    @PostMapping("/{id}/manager")
    public ResponseEntity<?> managerDetails(@PathVariable String id, @RequestBody String request) throws Exception {
        try {

            Hotel hotel = hotelRepo.findById(UUID.fromString(id)).orElse(null);
            if (hotel == null) {
                throw new Exception("Hotel Not Found.");
            }

            JsonNode json = Json.deserialize(JsonNode.class, request);
            String name = json.get("managerName").asText();
            String email = json.get("emailAddress").asText();
            String phone = json.get("mobileNumber").asText();
            String alternateContact = json.get("alternateContactNumber").asText();

            HotelNodalOffice nodalOffice = new HotelNodalOffice(hotel);
            nodalOffice.setFullName(name);
            nodalOffice.setEmail(email);
            nodalOffice.setMobileNumber(phone);
            nodalOffice.setAlternateContact(alternateContact);

            hotelNodalOfficeRepo.save(nodalOffice);

            return ResponseEntity.ok().body(Json.serialize("Manager Details Added Successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    // propety-details
    // /{id}/property-details

    @PostMapping("/{id}/property-details")
    public ResponseEntity<?> propertyDetails(@RequestBody String request) {
        try {
            return ResponseEntity.ok().body(null);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // food
    // /{id}/food

    @PostMapping("/{id}/food")
    public ResponseEntity<?> food(@RequestBody String request) {
        try {
            return ResponseEntity.ok().body(null);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // registration-details
    // /{id}/registration

    @PostMapping("/{id}/registration")
    public ResponseEntity<?> registrationDetails(@RequestBody String request) {
        try {
            return ResponseEntity.ok().body(null);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // banking-details
    // /{id}/bank

    @PostMapping("/{id}/bank")
    public ResponseEntity<?> bankingDetails(@RequestBody String request) {
        try {
            return ResponseEntity.ok().body(null);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // declaration
    // /{id}/declaration

    @PostMapping("/{id}/declaration")
    public ResponseEntity<?> declaration(@RequestBody String request) {
        try {
            return ResponseEntity.ok().body(null);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}

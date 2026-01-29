package org.bisag.jktourism.controllers.hotel;

import java.security.Principal;
import java.time.Instant;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.bisag.jktourism.exceptions.BadRequestException;
import org.bisag.jktourism.models.User;
import org.bisag.jktourism.models.hotel.Amenity;
import org.bisag.jktourism.models.hotel.Hotel;
import org.bisag.jktourism.models.hotel.HotelAmenityId;
import org.bisag.jktourism.models.hotel.HotelBanking;
import org.bisag.jktourism.models.hotel.HotelBasicInfo;
import org.bisag.jktourism.models.hotel.HotelDeclaration;
import org.bisag.jktourism.models.hotel.HotelDocument;
import org.bisag.jktourism.models.hotel.HotelFood;
import org.bisag.jktourism.models.hotel.HotelLocation;
import org.bisag.jktourism.models.hotel.HotelNodalOffice;
import org.bisag.jktourism.models.hotel.HotelOwner;
import org.bisag.jktourism.models.hotel.HotelProperty;
import org.bisag.jktourism.models.hotel.HotelPropertyAmenity;
import org.bisag.jktourism.models.hotel.HotelRoomType;
import org.bisag.jktourism.models.hotel.enums.AmenityScope;
import org.bisag.jktourism.models.hotel.enums.FoodType;
import org.bisag.jktourism.models.hotel.enums.HotelStatus;
import org.bisag.jktourism.record.AmenityDTO;
import org.bisag.jktourism.repository.UserRepository;
import org.bisag.jktourism.repository.hotel.AmenityRepository;
import org.bisag.jktourism.repository.hotel.HotelBankingRepository;
import org.bisag.jktourism.repository.hotel.HotelBasicInfoRepository;
import org.bisag.jktourism.repository.hotel.HotelDeclarationRepository;
import org.bisag.jktourism.repository.hotel.HotelDocumentRepository;
import org.bisag.jktourism.repository.hotel.HotelFoodRepository;
import org.bisag.jktourism.repository.hotel.HotelLocationRepository;
import org.bisag.jktourism.repository.hotel.HotelNodalOfficeRepository;
import org.bisag.jktourism.repository.hotel.HotelOwnerRepository;
import org.bisag.jktourism.repository.hotel.HotelPropertyRepository;
import org.bisag.jktourism.repository.hotel.HotelRepository;
import org.bisag.jktourism.utils.Json;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    private final HotelPropertyRepository hotelPropertyRepo;
    private final HotelOwnerRepository hotelOwnerRepo;
    private final AmenityRepository amenityRepo;
    private final HotelFoodRepository hotelFoodRepo;
    private final HotelDocumentRepository hotelDocumentRepo;
    private final HotelBankingRepository hotelBankingRepo;
    private final HotelDeclarationRepository hotelDeclarationRepo;
    private final UserRepository userRepository;

    // basic info
    // /basic-info

    @GetMapping("/basic-info")
    public ResponseEntity<?> getBasicInfo(Principal principal) throws Exception {
        try {

            User user = userRepository.findByUsername(principal.getName()).orElse(null);
            if (user == null) {
                throw new Exception("User Not Found.");
            }

            Hotel hotel = hotelRepo.findByOwnerUserId(UUID.fromString(user.getUuid())).orElse(null);
            if (hotel == null) {
                throw new Exception("Hotel Not Found.");
            }

            HotelBasicInfo basicInfo = basicInfoRepo.findByHotelId(hotel.getId()).orElse(null);
            if (basicInfo == null) {
                throw new Exception("Basic Information Not Found.");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("legalName", hotel.getLegalName());
            response.put("displayName", hotel.getDisplayName());
            response.put("starRating", basicInfo.getStarRating());
            response.put("establishedYear", basicInfo.getEstablishedYear());
            response.put("websiteUrl", basicInfo.getWebsiteUrl());
            response.put("publicEmail", basicInfo.getPublicEmail());
            response.put("publicPhone", basicInfo.getPublicPhone());
            response.put("hotelType", basicInfo.getHotelType());

            return ResponseEntity.ok().body(Json.serialize(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

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

    @PostMapping(value = "/{id}/owner-details", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> ownerDetails(@PathVariable String id, @RequestParam String data,
            @RequestParam MultipartFile file) throws Exception {
        try {
            Hotel hotel = hotelRepo.findById(UUID.fromString(id)).orElse(null);
            if (hotel == null) {
                throw new Exception("Hotel Not Found.");
            }

            JsonNode json = Json.deserialize(JsonNode.class, data);

            String name = json.get("name").asText();
            String email = json.get("email").asText();
            String mobile = json.get("mobile").asText();
            String idProofType = json.get("idProofType").asText();

            HotelOwner owner = new HotelOwner(hotel);
            owner.setName(name);
            owner.setEmail(email);
            owner.setMobile(mobile);
            owner.setIdProofType(idProofType);

            hotelOwnerRepo.save(owner);

            return ResponseEntity.ok().body(Json.serialize("Owner Details Added Successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    // nodal-details
    // /{id}/manager
    @PostMapping("/{id}/manager")
    public ResponseEntity<?> managerDetails(@PathVariable String id, @RequestBody String request) throws Exception {
        try {

            Hotel hotel = hotelRepo.findById(UUID.fromString(id)).orElse(null);
            if (hotel == null) {
                throw new Exception("Hotel Not Found.");
            }

            JsonNode json = Json.deserialize(JsonNode.class, request);
            String name = json.get("name").asText();
            String email = json.get("email").asText();
            String phone = json.get("mobile").asText();
            String alternateContact = json.get("alternateContact").asText();

            HotelNodalOffice nodalOffice = new HotelNodalOffice(hotel);
            nodalOffice.setName(name);
            nodalOffice.setEmail(email);
            nodalOffice.setMobile(phone);
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
    public ResponseEntity<?> propertyDetails(@PathVariable String id, @RequestBody String request) throws Exception {
        try {

            Hotel hotel = hotelRepo.findById(UUID.fromString(id)).orElse(null);
            if (hotel == null) {
                throw new Exception("Hotel Not Found.");
            }

            JsonNode json = Json.deserialize(JsonNode.class, request);
            LocalTime checkInTime = LocalTime.parse(json.get("checkInTime").asText());
            LocalTime checkOutTime = LocalTime.parse(json.get("checkOutTime").asText());
            int parkingCapacity = json.get("parkingCapacity").asInt();
            boolean liftAvailable = json.get("liftAvailable").asBoolean();
            boolean powerBackup = json.get("powerBackup").asBoolean();
            boolean wheelchairAccessible = json.get("wheelchairAccessible").asBoolean();

            HotelProperty property = new HotelProperty(hotel);
            property.setCheckInTime(checkInTime);
            property.setCheckOutTime(checkOutTime);
            property.setParkingCapacity(parkingCapacity);
            property.setLiftAvailable(liftAvailable);
            property.setPowerBackup(powerBackup);
            property.setWheelchairAccessible(wheelchairAccessible);

            hotelPropertyRepo.save(property);

            // HotelRoomType roomType = new HotelRoomType(hotel);
            // hotelRoomTypeRepo.save(roomType);

            return ResponseEntity.ok().body(Json.serialize("Property Details Added Successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @PostMapping("/amenities")
    public ResponseEntity<?> getAmenities(@RequestBody String request) throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, request);
            String scope = json.get("scope").asText();
            List<AmenityDTO> amenities = amenityRepo.findByScope(AmenityScope.valueOf(scope));
            return ResponseEntity.ok().body(Json.serialize(amenities));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @PostMapping("/{id}/amenities")
    public ResponseEntity<?> amenities(
            @PathVariable String id,
            @RequestBody String request) throws Exception {
        try {
            Hotel hotel = hotelRepo.findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestException("Hotel Not Found"));

            JsonNode json = Json.deserialize(JsonNode.class, request);

            List<Long> amenityIds = new ArrayList<>();
            for (JsonNode node : json.get("amenities")) {
                amenityIds.add(node.asLong());
            }

            List<Amenity> amenityList = amenityRepo.findAllById(amenityIds);

            if (amenityList.isEmpty()) {
                throw new BadRequestException("No valid amenities found");
            }

            // 🔴 IMPORTANT: clear existing amenities (overwrite behavior)
            hotel.getPropertyAmenities().clear();

            for (Amenity amenity : amenityList) {

                HotelPropertyAmenity mapping = new HotelPropertyAmenity();

                HotelAmenityId amenityId = new HotelAmenityId();
                amenityId.setHotelId(hotel.getId()); // UUID → adapt if needed
                amenityId.setAmenityId(amenity.getId());

                mapping.setId(amenityId);
                mapping.setHotel(hotel);
                mapping.setAmenity(amenity);

                hotel.getPropertyAmenities().add(mapping);
            }

            hotelRepo.save(hotel);

            return ResponseEntity.ok(
                    Json.serialize("Amenities Added Successfully."));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Json.serialize(e.getMessage()));
        }
    }

    // food
    // /{id}/food
    @PostMapping("/{id}/food")
    public ResponseEntity<?> food(@PathVariable String id, @RequestBody String request) throws Exception {
        try {

            Hotel hotel = hotelRepo.findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestException("Hotel Not Found"));

            JsonNode json = Json.deserialize(JsonNode.class, request);

            boolean inHouseRestaurant = json.get("inHouseRestaurant").asBoolean();
            boolean roomService = json.get("roomService").asBoolean();
            String foodType = json.get("foodType").asText();

            HotelFood food = new HotelFood(hotel);
            food.setInhouseRestaurant(inHouseRestaurant);
            food.setRoomService(roomService);
            // NON-VEG -> NON_VEG
            // VEG -> VEG
            // BOTH -> BOTH
            food.setFoodType(FoodType.valueOf(foodType.toUpperCase().replace("-", "_")));

            hotelFoodRepo.save(food);

            return ResponseEntity.ok().body(Json.serialize("Food Details Added Successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    // registration-details
    // /{id}/registration

    @PostMapping("/{id}/registration")
    public ResponseEntity<?> registrationDetails(@PathVariable String id, @RequestParam String data,
            @RequestParam(required = false) MultipartFile file) throws Exception {
        try {
            Hotel hotel = hotelRepo.findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestException("Hotel Not Found"));

            JsonNode json = Json.deserialize(JsonNode.class, data);
            String registrationNumber = json.get("registrationNumber").asText();

            HotelDocument document = new HotelDocument(hotel);
            document.setRegistrationNumber(registrationNumber);
            // document.setFile();

            hotelDocumentRepo.save(document);

            return ResponseEntity.ok().body(Json.serialize("Registration Details Added Successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    // banking-details
    // /{id}/bank

    @PostMapping(value = "/{id}/bank", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> bankingDetails(@PathVariable String id, @RequestParam String data,
            @RequestParam(required = false) MultipartFile file) throws Exception {
        try {
            Hotel hotel = hotelRepo.findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestException("Hotel Not Found"));

            JsonNode json = Json.deserialize(JsonNode.class, data);
            String bankName = json.get("bankName").asText();
            String accountNumber = json.get("accountNumber").asText();
            String confirmAccountNumber = json.get("confirmAccountNumber").asText();
            String ifscCode = json.get("ifscCode").asText();
            String accountHolderName = json.get("accountHolderName").asText();

            if (!accountNumber.equals(confirmAccountNumber)) {
                throw new BadRequestException("Account Number and Confirm Account Number do not match");
            }

            HotelBanking bank = new HotelBanking(hotel);
            bank.setBankName(bankName);
            bank.setAccountNumber(accountNumber);
            bank.setIfscCode(ifscCode);
            bank.setAccountHolderName(accountHolderName);

            hotelBankingRepo.save(bank);

            return ResponseEntity.ok().body(Json.serialize("Bank Details Added Successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    // declaration
    // /{id}/declaration

    @PostMapping("/{id}/declaration")
    public ResponseEntity<?> declaration(@PathVariable String id, @RequestBody String data) throws Exception {
        try {
            Hotel hotel = hotelRepo.findById(UUID.fromString(id))
                    .orElseThrow(() -> new BadRequestException("Hotel Not Found"));

            JsonNode json = Json.deserialize(JsonNode.class, data);

            boolean consent = json.get("consent").asBoolean();
            String ownerName = json.get("ownerName").asText();
            String declarationDate = json.get("declarationDate").asText();

            HotelDeclaration declaration = new HotelDeclaration(hotel);
            declaration.setDeclarationAccepted(consent);
            declaration.setSignedName(ownerName);
            // "2026-01-29" -> 2026-01-29T00:00:00Z
            declaration.setSignedAt(Instant.parse(declarationDate + "T00:00:00Z"));

            hotelDeclarationRepo.save(declaration);

            return ResponseEntity.ok().body(Json.serialize("Declaration Added Successfully."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }
}

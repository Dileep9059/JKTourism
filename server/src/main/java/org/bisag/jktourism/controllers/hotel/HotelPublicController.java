package org.bisag.jktourism.controllers.hotel;

import java.util.List;
import java.util.UUID;

import org.bisag.jktourism.dto.janta.PublicHotelDetailDto;
import org.bisag.jktourism.dto.janta.PublicHotelListDto;
import org.bisag.jktourism.models.hotel.Hotel;
import org.bisag.jktourism.models.hotel.HotelPhoto;
import org.bisag.jktourism.models.hotel.HotelRoomType;
import org.bisag.jktourism.models.hotel.HotelPropertyAmenity;
import org.bisag.jktourism.models.hotel.enums.HotelStatus;
import org.bisag.jktourism.repository.hotel.HotelRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/hotels")
@RequiredArgsConstructor
public class HotelPublicController {

    private final HotelRepository hotelRepo;

    @PostMapping("/hotellist")
    public ResponseEntity<?> getHotelList(@RequestBody(required = false) HotelSearchRequest req) {
        try {
            if (req == null) req = new HotelSearchRequest();

            int page = req.getPage() != null ? req.getPage() : 0;
            int size = req.getSize() != null ? Math.min(req.getSize(), 50) : 10;

            Pageable pageable = PageRequest.of(page, size);

            Page<PublicHotelListDto> hotelList = hotelRepo.findPublicHotels(
                    req.getName(),
                    req.getDistrict(),
                    req.getHotelType(),
                    req.getStarRating(),
                    req.getRoomType(),
                    pageable
            );

            return ResponseEntity.ok().body(hotelList);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHotelDetail(@PathVariable UUID id) {
        try {
            Hotel hotel = hotelRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));

            if (hotel.getStatus() != HotelStatus.APPROVED) {
                return ResponseEntity.status(403).body("Hotel not available");
            }

            PublicHotelDetailDto dto = new PublicHotelDetailDto();
            dto.setHotelId(hotel.getId());
            dto.setDisplayName(hotel.getDisplayName());
            dto.setLegalName(hotel.getLegalName());

            // Basic Info
            if (hotel.getBasicInfo() != null) {
                dto.setDescription(hotel.getBasicInfo().getDescription());
                dto.setHotelType(hotel.getBasicInfo().getHotelType());
                dto.setStarRating(hotel.getBasicInfo().getStarRating());
                dto.setEstablishedYear(hotel.getBasicInfo().getEstablishedYear());
                dto.setPublicEmail(hotel.getBasicInfo().getPublicEmail());
                dto.setPublicPhone(hotel.getBasicInfo().getPublicPhone());
                dto.setWebsiteUrl(hotel.getBasicInfo().getWebsiteUrl());
            }

            // Location
            if (hotel.getLocation() != null) {
                dto.setAddressLine1(hotel.getLocation().getAddressLine1());
                dto.setCity(hotel.getLocation().getCity());
                dto.setDistrict(hotel.getLocation().getDistrict());
                dto.setState(hotel.getLocation().getState());
                dto.setPincode(hotel.getLocation().getPincode());
                dto.setLandmark(hotel.getLocation().getLandmark());
                dto.setLatitude(hotel.getLocation().getLatitude());
                dto.setLongitude(hotel.getLocation().getLongitude());
                dto.setGoogleMapsUrl(hotel.getLocation().getGoogleMapsUrl());
            }

            // Photos
            if (hotel.getPhotos() != null) {
                List<String> photos = hotel.getPhotos().stream()
                        .sorted((a, b) -> {
                            int ao = a.getSortOrder() != null ? a.getSortOrder() : 999;
                            int bo = b.getSortOrder() != null ? b.getSortOrder() : 999;
                            return ao - bo;
                        })
                        .map(HotelPhoto::getPhotoUrl)
                        .toList();
                dto.setPhotos(photos);
            }

            // Room Types
            if (hotel.getRoomTypes() != null) {
                List<PublicHotelDetailDto.RoomTypeInfo> rooms = hotel.getRoomTypes().stream()
                        .map(rt -> new PublicHotelDetailDto.RoomTypeInfo(
                                rt.getRoomTypeName(),
                                rt.getRoomCount(),
                                rt.getTariff() != null ? rt.getTariff().doubleValue() : null))
                        .toList();
                dto.setRoomTypes(rooms);
            }

            // Amenities
            if (hotel.getPropertyAmenities() != null) {
                List<PublicHotelDetailDto.AmenityInfo> amenities = hotel.getPropertyAmenities().stream()
                        .map(hpa -> new PublicHotelDetailDto.AmenityInfo(
                                hpa.getAmenity().getName(),
                                hpa.getAmenity().getIcon(),
                                hpa.getAmenity().getScope().name()))
                        .toList();
                dto.setAmenities(amenities);
            }

            // Property
            if (hotel.getProperty() != null) {
                dto.setCheckInTime(hotel.getProperty().getCheckInTime() != null
                        ? hotel.getProperty().getCheckInTime().toString() : null);
                dto.setCheckOutTime(hotel.getProperty().getCheckOutTime() != null
                        ? hotel.getProperty().getCheckOutTime().toString() : null);
                dto.setParkingAvailable(hotel.getProperty().getParkingCapacity() != null
                        && hotel.getProperty().getParkingCapacity() > 0);
                dto.setLiftAvailable(hotel.getProperty().getLiftAvailable());
                dto.setPowerBackup(hotel.getProperty().getPowerBackup());
                dto.setWheelchairAccessible(hotel.getProperty().getWheelchairAccessible());
            }

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Inner request DTO ──────────────────────────────────────────────────
    public static class HotelSearchRequest {
        private String name;
        private String district;
        private String hotelType;
        private Integer starRating;
        private String roomType;
        private Integer page;
        private Integer size;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
        public String getHotelType() { return hotelType; }
        public void setHotelType(String hotelType) { this.hotelType = hotelType; }
        public Integer getStarRating() { return starRating; }
        public void setStarRating(Integer starRating) { this.starRating = starRating; }
        public String getRoomType() { return roomType; }
        public void setRoomType(String roomType) { this.roomType = roomType; }
        public Integer getPage() { return page; }
        public void setPage(Integer page) { this.page = page; }
        public Integer getSize() { return size; }
        public void setSize(Integer size) { this.size = size; }
    }
}

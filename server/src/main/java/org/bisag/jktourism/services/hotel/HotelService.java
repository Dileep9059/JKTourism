package org.bisag.jktourism.services.hotel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.dto.admin.AmenityDto;
import org.bisag.jktourism.dto.admin.HotelAdminListDto;
import org.bisag.jktourism.dto.admin.HotelApprovalDto;
import org.bisag.jktourism.dto.admin.HotelBasicInfoDto;
import org.bisag.jktourism.dto.admin.HotelLocationDto;
import org.bisag.jktourism.dto.admin.HotelOwnerDto;
import org.bisag.jktourism.dto.admin.HotelPropertyDto;
import org.bisag.jktourism.dto.admin.HotelRoomTypeDto;
import org.bisag.jktourism.models.hotel.Amenity;
import org.bisag.jktourism.models.hotel.Hotel;
import org.bisag.jktourism.models.hotel.HotelBasicInfo;
import org.bisag.jktourism.models.hotel.HotelLocation;
import org.bisag.jktourism.models.hotel.HotelOwner;
import org.bisag.jktourism.models.hotel.HotelProperty;
import org.bisag.jktourism.models.hotel.HotelPropertyAmenity;
import org.bisag.jktourism.models.hotel.HotelRoomType;
import org.bisag.jktourism.models.hotel.enums.HotelStatus;
import org.bisag.jktourism.repository.hotel.HotelRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HotelService {
    private final Crypto crypto;
    private final HotelRepository hotelRepository;

    public Page<HotelAdminListDto> getHotelsForApproval(
            HotelStatus status,
            int page,
            int size,
            Sort sort) {
        Pageable pageable = PageRequest.of(page, size, sort);
        return hotelRepository.findForAdminApproval(status, pageable);
    }

    public Map<String, Long> getHotelStatusCounts() {
        List<Object[]> rows = hotelRepository.countByStatusRaw();

        Map<String, Long> result = new HashMap<>();
        // initialize all statuses to 0
        for (HotelStatus status : HotelStatus.values()) {
            result.put(status.name().toLowerCase(), 0L);
        }

        long total = 0;
        for (Object[] row : rows) {
            HotelStatus status = (HotelStatus) row[0];
            Long count = (Long) row[1];
            result.put(status.name().toLowerCase(), count);
            total += count;
        }

        result.put("total", total);

        return result;
    }

    public HotelApprovalDto getHotelDetailsForApproval(UUID hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        HotelApprovalDto dto = new HotelApprovalDto();
        dto.setHotelId(hotel.getId());
        dto.setLegalName(hotel.getLegalName());
        dto.setDisplayName(hotel.getDisplayName());
        dto.setStatus(hotel.getStatus());
        dto.setSubmittedAt(hotel.getSubmittedAt());
        dto.setApprovedAt(hotel.getApprovedAt());

        // Basic Info
        if (hotel.getBasicInfo() != null) {
            HotelBasicInfo bi = hotel.getBasicInfo();
            dto.setBasicInfo(new HotelBasicInfoDto(
                    bi.getRegistrationNumber(),
                    bi.getWebsite(),
                    bi.getEmail(),
                    bi.getMobile()));
        }

        // Location
        if (hotel.getLocation() != null) {
            HotelLocation loc = hotel.getLocation();
            dto.setLocation(new HotelLocationDto(
                    loc.getAddressLine1(),
                    loc.getAddressLine2(),
                    loc.getCity(),
                    loc.getDistrict(),
                    loc.getState(),
                    loc.getPincode(),
                    loc.getLatitude(),
                    loc.getLongitude(),
                    loc.getLandmark(),
                    loc.getGoogleMapsUrl()));
        }

        // Owner
        if (hotel.getOwner() != null) {
            HotelOwner o = hotel.getOwner();
            dto.setOwner(new HotelOwnerDto(
                    o.getName(),
                    o.getMobile(),
                    o.getEmail()));
        }

        // Property
        if (hotel.getProperty() != null) {
            HotelProperty p = hotel.getProperty();
            dto.setProperty(new HotelPropertyDto(
                    // p.getTotalRooms(),
                    // p.getFloors(),
                    p.getCheckInTime(),
                    p.getCheckOutTime()));
        }

        // Room Types
        List<HotelRoomTypeDto> roomDtos = new ArrayList<>();
        if (hotel.getRoomTypes() != null) {
            for (HotelRoomType room : hotel.getRoomTypes()) {
                roomDtos.add(new HotelRoomTypeDto(
                        room.getType(),
                        room.getNumberOfRooms(),
                        room.getTariff(),
                        room.getAmenities().stream()
                                .map(a -> a.getAmenity().getName())
                                .toList(),
                        room.getImages().stream()
                                .map(img -> img.getUrl())
                                .toList()));
            }
        }
        dto.setRoomTypes(roomDtos);

        // Property Amenities
        List<AmenityDto> amenities = new ArrayList<>();
        if (hotel.getPropertyAmenities() != null) {
            for (HotelPropertyAmenity hpa : hotel.getPropertyAmenities()) {
                Amenity a = hpa.getAmenity();
                amenities.add(new AmenityDto(
                        a.getId(),
                        a.getName(),
                        a.getScope().name(),
                        a.getIcon()));
            }
        }
        dto.setAmenities(amenities);

        return dto;
    }
}

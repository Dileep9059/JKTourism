package org.bisag.jktourism.dto.janta;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PublicHotelDetailDto {

    private UUID hotelId;
    private String displayName;
    private String legalName;

    // Basic Info
    private String description;
    private String hotelType;
    private Integer starRating;
    private Integer establishedYear;
    private String publicEmail;
    private String publicPhone;
    private String websiteUrl;

    // Location
    private String addressLine1;
    private String city;
    private String district;
    private String state;
    private String pincode;
    private String landmark;
    private Double latitude;
    private Double longitude;
    private String googleMapsUrl;

    // Photos
    private List<String> photos;

    // Room Types
    private List<RoomTypeInfo> roomTypes;

    // Amenities
    private List<AmenityInfo> amenities;

    // Property
    private String checkInTime;
    private String checkOutTime;
    private Boolean parkingAvailable;
    private Boolean liftAvailable;
    private Boolean powerBackup;
    private Boolean wheelchairAccessible;

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor
    public static class RoomTypeInfo {
        private String roomTypeName;
        private Integer roomCount;
        private Double tariff;
    }

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor
    public static class AmenityInfo {
        private String name;
        private String icon;
        private String scope;
    }
}

package org.bisag.jktourism.dto.admin;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.bisag.jktourism.models.hotel.enums.HotelStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HotelAdminListDto {

    private UUID hotelId;

    private String legalName;
    private String displayName;

    private String city;
    private String district;

    private String ownerName;
    private String ownerMobile;
    private String ownerEmail;

    private HotelStatus status;

    private String submittedAt;

    private static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy")
            .withZone(ZoneId.of("Asia/Kolkata"));

    public HotelAdminListDto(UUID hotelId, String legalName, String displayName, String city, String district,
            String ownerName, String ownerMobile, String ownerEmail, HotelStatus status, Instant submittedAt) {
        this.hotelId = hotelId;
        this.legalName = legalName;
        this.displayName = displayName;
        this.city = city;
        this.district = district;
        this.ownerName = ownerName;
        this.ownerMobile = ownerMobile;
        this.ownerEmail = ownerEmail;
        this.status = status;
        this.submittedAt = submittedAt != null ? formatter.format(submittedAt) : null;
    }
}

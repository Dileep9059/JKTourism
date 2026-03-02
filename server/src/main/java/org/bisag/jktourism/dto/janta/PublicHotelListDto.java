package org.bisag.jktourism.dto.janta;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PublicHotelListDto {

    private UUID id;
    private String displayName;
    private String legalName;

    // Location
    private String city;
    private String district;
    private String state;
    private String landmark;

    // Basic Info
    private String description;
    private Integer starRating;
    private String hotelType;

    // Pricing — minimum tariff across all room types
    private BigDecimal minTariff;

    // Cover photo (first photo by sort order)
    private String coverPhotoUrl;
}

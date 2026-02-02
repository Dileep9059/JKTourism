package org.bisag.jktourism.dto.admin;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.bisag.jktourism.models.hotel.enums.HotelStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HotelApprovalDto {

    private UUID hotelId;
    private String legalName;
    private String displayName;
    private HotelStatus status;
    private Instant submittedAt;
    private Instant approvedAt;

    private HotelBasicInfoDto basicInfo;
    private HotelLocationDto location;
    private HotelOwnerDto owner;
    private HotelPropertyDto property;
    private List<HotelRoomTypeDto> roomTypes;
    private List<AmenityDto> amenities;
}

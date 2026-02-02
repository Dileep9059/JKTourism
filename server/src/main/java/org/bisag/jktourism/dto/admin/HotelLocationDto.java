package org.bisag.jktourism.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class HotelLocationDto {
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String district;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private String landmark;
    private String googleMapsUrl;
}

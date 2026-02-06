package org.bisag.jktourism.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HotelBasicInfoDto {
    private String description;
    private String hotelType;
    private Integer starRating;
    private Integer establishedYear;
    private String website;
    private String email;
    private String mobile;
}

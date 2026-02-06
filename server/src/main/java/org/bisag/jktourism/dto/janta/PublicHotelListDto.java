package org.bisag.jktourism.dto.janta;

import java.time.Instant;
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
    private String city;
    private String district;
    private String state;
}
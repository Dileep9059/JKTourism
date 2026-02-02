package org.bisag.jktourism.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class AmenityDto {
    private Long id;
    private String name;
    private String scope; // ROOM / PROPERTY
    private String icon;
}

package org.bisag.jktourism.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class HotelOwnerDto {
    private String name;
    private String mobile;
    private String email;
}

package org.bisag.jktourism.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class HotelPropertyDto {
    // private int totalRooms;
    // private int floors;
    private String checkInTime;
    private String checkOutTime;
}

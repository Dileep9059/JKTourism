package org.bisag.jktourism.dto.admin;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class HotelRoomTypeDto {
    private String type;
    private int numberOfRooms;
    private double tariff;
    private List<String> amenities;
    private List<String> images;
}

package org.bisag.jktourism.dto.admin;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HotelPropertyDto {
    private LocalTime checkInTime;
    private LocalTime checkOutTime;

    private Integer parkingCapacity;
    private Boolean liftAvailable;
    private Boolean powerBackup;
    private Boolean wheelchairAccessible;
}

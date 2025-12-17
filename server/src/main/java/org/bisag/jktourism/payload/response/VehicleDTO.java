package org.bisag.jktourism.payload.response;

import lombok.Data;

@Data
public class VehicleDTO {
    private String uuid;
    private String vehicleNumber;
    private String vehicleType;
    private Integer capacity;
    private String rate;
}

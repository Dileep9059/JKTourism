package org.bisag.jktourism.payload.response;

import java.util.List;

import lombok.Data;

@Data
public class TransportServiceDetailsDTO {
    private String uuid;
    private String name;
    private String location;
    private String district;
    private String state;
    private String email;
    private String contact;
    private String registrationDetail;
    private List<VehicleDTO> vehicles;
}

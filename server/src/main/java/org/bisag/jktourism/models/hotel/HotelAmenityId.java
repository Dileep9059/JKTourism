package org.bisag.jktourism.models.hotel;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter @Setter
public class HotelAmenityId implements Serializable {

    private long hotelId;
    private long amenityId;
}

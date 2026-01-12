package org.bisag.jktourism.models.hotel;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "hotel_property_amenities")
@Getter @Setter
public class HotelPropertyAmenity {
    @EmbeddedId
    private HotelAmenityId id;

    @ManyToOne
    @MapsId("hotelId")
    private Hotel hotel;

    @ManyToOne
    @MapsId("amenityId")
    private Amenity amenity;
}

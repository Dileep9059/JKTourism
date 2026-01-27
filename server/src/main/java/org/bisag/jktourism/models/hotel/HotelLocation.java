package org.bisag.jktourism.models.hotel;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "hotel_location")
@Getter
@Setter
public class HotelLocation {

    @Id
    private UUID hotelId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String district;
    private String state;
    private String pincode;

    private Double latitude;
    private Double longitude;

    private String landmark;
    private String googleMapsUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    // ✅ REQUIRED by JPA
    protected HotelLocation() {
    }

    public HotelLocation(Hotel hotel) {
        this.hotel = hotel;
    }
}

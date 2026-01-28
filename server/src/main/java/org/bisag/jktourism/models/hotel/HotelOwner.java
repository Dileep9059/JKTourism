package org.bisag.jktourism.models.hotel;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "hotel_owner")
@Getter
@Setter
public class HotelOwner {
    @Id
    private UUID hotelId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    private String name;
    private String email;
    private String mobile;

    private String idProofType;
    private String idProofFileUrl;

    public HotelOwner() {
    }

    public HotelOwner(Hotel hotel) {
        this.hotel = hotel;
    }
}

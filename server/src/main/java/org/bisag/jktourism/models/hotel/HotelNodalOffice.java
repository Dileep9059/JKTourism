package org.bisag.jktourism.models.hotel;

import java.time.Instant;
import java.util.UUID;

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
@Table(name = "hotel_nodal_officer")
@Getter
@Setter
public class HotelNodalOffice {
    @Id
    private UUID hotelId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String mobileNumber;

    @Column(nullable = false)
    private String email;

    private String alternateContact;

    @Column(nullable = false)
    private Boolean active = true;

    // audit
    private Instant effectiveFrom;
    private Instant effectiveTo;

    private UUID updatedBy;

    public HotelNodalOffice() {
    }

    public HotelNodalOffice(Hotel hotel) {
        this.hotel = hotel;
    }
}

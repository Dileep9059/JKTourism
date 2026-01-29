package org.bisag.jktourism.models.hotel;

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
@Table(name = "hotel_banking")
@Getter
@Setter
public class HotelBanking {

    @Id
    private UUID hotelId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    private String accountHolderName;
    private String bankName;
    private String accountNumber;
    private String ifscCode;

    @Column(columnDefinition = "TEXT")
    private String file;

    public HotelBanking(Hotel hotel) {
        this.hotel = hotel;
    }

    public HotelBanking() {
    }
}

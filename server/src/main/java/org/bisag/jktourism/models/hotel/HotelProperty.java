package org.bisag.jktourism.models.hotel;

import java.time.LocalTime;
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
@Table(name = "hotel_property")
@Getter
@Setter
public class HotelProperty {

    @Id
    private UUID hotelId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    private Integer floors;
    private Integer totalRooms;

    private LocalTime checkInTime;
    private LocalTime checkOutTime;

    private Integer parkingCapacity;
    private Boolean liftAvailable;
    private Boolean powerBackup;
    private Boolean wheelchairAccessible;
}

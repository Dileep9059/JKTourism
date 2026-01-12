package org.bisag.jktourism.models.hotel;

import java.util.UUID;

import org.bisag.jktourism.models.hotel.enums.FoodType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "hotel_food")
@Getter
@Setter
public class HotelFood {
    @Id
    private UUID hotelId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    private Boolean foodAvailable;

    @Enumerated(EnumType.STRING)
    private FoodType foodType;

    private Boolean inhouseRestaurant;
    private Boolean roomService;
}

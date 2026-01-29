package org.bisag.jktourism.repository.hotel;

import java.util.Optional;
import java.util.UUID;

import org.bisag.jktourism.models.hotel.HotelFood;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelFoodRepository extends JpaRepository<HotelFood, UUID> {
    Optional<HotelFood> findByHotelId(UUID hotelId);
}

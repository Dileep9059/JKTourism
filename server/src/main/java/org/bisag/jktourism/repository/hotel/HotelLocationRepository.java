package org.bisag.jktourism.repository.hotel;

import java.util.Optional;
import java.util.UUID;

import org.bisag.jktourism.models.hotel.HotelLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelLocationRepository extends JpaRepository<HotelLocation, UUID> {

    Optional<HotelLocation> findByHotelId(UUID hotelId);

}

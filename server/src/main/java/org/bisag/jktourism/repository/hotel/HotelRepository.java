package org.bisag.jktourism.repository.hotel;

import java.util.Optional;
import java.util.UUID;

import org.bisag.jktourism.models.hotel.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, UUID> {
    Optional<Hotel> findById(UUID id);
}

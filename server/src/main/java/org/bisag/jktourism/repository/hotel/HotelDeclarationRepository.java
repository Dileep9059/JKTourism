package org.bisag.jktourism.repository.hotel;

import java.util.Optional;
import java.util.UUID;

import org.bisag.jktourism.models.hotel.Hotel;
import org.bisag.jktourism.models.hotel.HotelDeclaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelDeclarationRepository extends JpaRepository<HotelDeclaration, UUID> {
    Optional<HotelDeclaration> findByHotelId(UUID hotelId);

    Optional<HotelDeclaration> findByHotel(Hotel hotel);
}

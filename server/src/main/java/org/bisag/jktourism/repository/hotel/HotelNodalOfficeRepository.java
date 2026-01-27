package org.bisag.jktourism.repository.hotel;

import java.util.Optional;
import java.util.UUID;

import org.bisag.jktourism.models.hotel.HotelNodalOffice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelNodalOfficeRepository extends JpaRepository<HotelNodalOffice, UUID> {
    Optional<HotelNodalOffice> findByHotelId(UUID hotelId);
}

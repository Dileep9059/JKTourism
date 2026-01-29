package org.bisag.jktourism.repository.hotel;

import java.util.Optional;
import java.util.UUID;

import org.bisag.jktourism.models.hotel.Hotel;
import org.bisag.jktourism.models.hotel.HotelDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelDocumentRepository extends JpaRepository<HotelDocument, Long> {
    Optional<HotelDocument> findByHotel(Hotel hotel);
    
}

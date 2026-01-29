package org.bisag.jktourism.repository.hotel;

import java.util.Optional;
import java.util.UUID;

import org.bisag.jktourism.models.hotel.HotelBanking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelBankingRepository extends JpaRepository<HotelBanking, UUID> {

    Optional<HotelBanking> findByHotelId(UUID hotelId);
    
}

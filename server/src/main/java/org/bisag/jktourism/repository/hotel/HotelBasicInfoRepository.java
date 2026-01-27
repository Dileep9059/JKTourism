package org.bisag.jktourism.repository.hotel;

import java.util.Optional;
import java.util.UUID;

import org.bisag.jktourism.models.hotel.HotelBasicInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelBasicInfoRepository extends JpaRepository<HotelBasicInfo, UUID> {
    Optional<HotelBasicInfo> findByHotelId(UUID hotelId);
}

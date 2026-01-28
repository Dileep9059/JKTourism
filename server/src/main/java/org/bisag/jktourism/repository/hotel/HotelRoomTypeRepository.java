package org.bisag.jktourism.repository.hotel;

import java.util.UUID;

import org.bisag.jktourism.models.hotel.Hotel;
import org.bisag.jktourism.models.hotel.HotelRoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface HotelRoomTypeRepository extends JpaRepository<HotelRoomType, UUID>{
    List<HotelRoomType> findByHotel(Hotel hotel);
}

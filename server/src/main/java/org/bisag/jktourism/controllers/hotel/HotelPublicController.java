package org.bisag.jktourism.controllers.hotel;

import java.util.List;

import org.bisag.jktourism.dto.janta.PublicHotelListDto;
import org.bisag.jktourism.models.hotel.Hotel;
import org.bisag.jktourism.repository.hotel.HotelRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/hotels")
@RequiredArgsConstructor
public class HotelPublicController {

    private final HotelRepository hotelRepo;

    @PostMapping("/hotellist")
    public ResponseEntity<?> getHotelList() {
        try {
            Page<PublicHotelListDto> hotelList = hotelRepo.findPublicHotels("", "Jammu", Pageable.unpaged());
            return ResponseEntity.ok().body(hotelList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}

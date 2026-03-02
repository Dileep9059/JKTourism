package org.bisag.jktourism.controllers.hotel;

import org.bisag.jktourism.dto.janta.PublicHotelListDto;
import org.bisag.jktourism.repository.hotel.HotelRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/hotels")
@RequiredArgsConstructor
public class HotelPublicController {

    private final HotelRepository hotelRepo;

    /**
     * POST /api/v1/hotels/hotellist
     *
     * Body (all fields optional):
     * {
     *   "name":       "Radisson",   // hotel display name (partial match)
     *   "district":   "Srinagar",   // exact district name
     *   "hotelType":  "Resort",     // e.g. Hotel, Resort, Boutique
     *   "starRating": 4,            // 1–5
     *   "page":       0,            // 0-based page index (default 0)
     *   "size":       10            // page size (default 10, max 50)
     * }
     */
    @PostMapping("/hotellist")
    public ResponseEntity<?> getHotelList(@RequestBody(required = false) HotelSearchRequest req) {
        try {
            if (req == null) req = new HotelSearchRequest();

            int page = req.getPage() != null ? req.getPage() : 0;
            int size = req.getSize() != null ? Math.min(req.getSize(), 50) : 10;

            Pageable pageable = PageRequest.of(page, size);

            Page<PublicHotelListDto> hotelList = hotelRepo.findPublicHotels(
                    req.getName(),
                    req.getDistrict(),
                    req.getHotelType(),
                    req.getStarRating(),
                    pageable
            );

            return ResponseEntity.ok().body(hotelList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Inner request class (keeps things self-contained) ──────────────────
    public static class HotelSearchRequest {
        private String name;
        private String district;
        private String hotelType;
        private Integer starRating;
        private Integer page;
        private Integer size;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }

        public String getHotelType() { return hotelType; }
        public void setHotelType(String hotelType) { this.hotelType = hotelType; }

        public Integer getStarRating() { return starRating; }
        public void setStarRating(Integer starRating) { this.starRating = starRating; }

        public Integer getPage() { return page; }
        public void setPage(Integer page) { this.page = page; }

        public Integer getSize() { return size; }
        public void setSize(Integer size) { this.size = size; }
    }
}

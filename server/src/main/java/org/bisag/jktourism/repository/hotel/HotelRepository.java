package org.bisag.jktourism.repository.hotel;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.bisag.jktourism.dto.admin.HotelAdminListDto;
import org.bisag.jktourism.dto.janta.PublicHotelListDto;
import org.bisag.jktourism.models.hotel.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HotelRepository extends JpaRepository<Hotel, UUID> {
    Optional<Hotel> findById(UUID id);

    Optional<Hotel> findByOwnerUserId(UUID ownerUserId);

    @Query("""
                SELECT new org.bisag.jktourism.dto.admin.HotelAdminListDto(
                    h.id,
                    h.legalName,
                    h.displayName,
                    l.city,
                    l.district,
                    o.name,
                    o.mobile,
                    o.email,
                    h.status,
                    h.submittedAt
                )
                FROM Hotel h
                LEFT JOIN h.location l
                LEFT JOIN h.owner o
                WHERE h.status != org.bisag.jktourism.models.hotel.enums.HotelStatus.DRAFT
                ORDER BY h.createdAt DESC
            """)
    Page<HotelAdminListDto> findForAdminApproval(
            Pageable pageable);

    @Query("""
                SELECT h.status, COUNT(h)
                FROM Hotel h
                GROUP BY h.status
            """)
    List<Object[]> countByStatusRaw();

    /**
     * Public hotel search — only APPROVED hotels are returned.
     *
     * Filters:
     *   :name     — partial match on displayName (pass "" or null to skip)
     *   :district — exact match on district     (pass "" or null to skip)
     *   :hotelType — exact match on hotelType   (pass "" or null to skip)
     *   :starRating — exact star rating         (pass null to skip)
     *
     * Returns one row per hotel. coverPhotoUrl comes from the hotel_photos
     * row with the lowest sort_order value (a sub-select keeps the main
     * query non-duplicating without a GROUP BY on every column).
     */
    @Query("""
                SELECT new org.bisag.jktourism.dto.janta.PublicHotelListDto(
                    h.id,
                    h.displayName,
                    h.legalName,
                    loc.city,
                    loc.district,
                    loc.state,
                    loc.landmark,
                    bi.description,
                    bi.starRating,
                    bi.hotelType,
                    (SELECT MIN(rt.tariff) FROM HotelRoomType rt WHERE rt.hotel = h),
                    (SELECT p.photoUrl FROM HotelPhoto p
                        WHERE p.hotel = h
                        ORDER BY p.sortOrder ASC, p.createdAt ASC
                        LIMIT 1)
                )
                FROM Hotel h
                LEFT JOIN h.location loc
                LEFT JOIN h.basicInfo bi
                WHERE h.status = org.bisag.jktourism.models.hotel.enums.HotelStatus.APPROVED
                  AND (:name     IS NULL OR :name     = '' OR LOWER(h.displayName) LIKE LOWER(CONCAT('%', :name,     '%')))
                  AND (:district IS NULL OR :district = '' OR LOWER(loc.district)  = LOWER(:district))
                  AND (:hotelType IS NULL OR :hotelType = '' OR LOWER(bi.hotelType) = LOWER(:hotelType))
                  AND (:starRating IS NULL OR bi.starRating = :starRating)
                ORDER BY h.approvedAt DESC
            """)
    Page<PublicHotelListDto> findPublicHotels(
            @Param("name") String name,
            @Param("district") String district,
            @Param("hotelType") String hotelType,
            @Param("starRating") Integer starRating,
            Pageable pageable);

    void deleteById(UUID id);
}

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

    @Query("""
                SELECT new org.bisag.jktourism.dto.janta.PublicHotelListDto(
                    h.id,
                    h.displayName,
                    h.legalName,
                    loc.city,
                    loc.district,
                    loc.state
                )
                FROM Hotel h
                JOIN h.location loc
                WHERE h.status = org.bisag.jktourism.models.hotel.enums.HotelStatus.APPROVED
                  AND (:name IS NULL OR LOWER(h.displayName) LIKE LOWER(CONCAT('%', :name, '%')))
                  AND (:district IS NULL OR LOWER(loc.district) = LOWER(:district))
                ORDER BY h.approvedAt DESC
            """)
    Page<PublicHotelListDto> findPublicHotels(
            @Param("name") String name,
            @Param("district") String district,
            Pageable pageable);

}

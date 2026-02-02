package org.bisag.jktourism.repository.hotel;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.bisag.jktourism.dto.admin.HotelAdminListDto;
import org.bisag.jktourism.models.hotel.Hotel;
import org.bisag.jktourism.models.hotel.enums.HotelStatus;
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
                WHERE (:status IS NULL OR h.status = :status)
                ORDER BY h.createdAt DESC
            """)
    Page<HotelAdminListDto> findForAdminApproval(
            @Param("status") HotelStatus status,
            Pageable pageable);

    @Query("""
                SELECT h.status, COUNT(h)
                FROM Hotel h
                GROUP BY h.status
            """)
    List<Object[]> countByStatusRaw();

}

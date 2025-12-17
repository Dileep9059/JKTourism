package org.bisag.jktourism.repository;

import java.util.List;
import java.util.Optional;

import org.bisag.jktourism.models.TransportService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransportServiceRepository extends JpaRepository<TransportService, Long> {

    @Query("SELECT DISTINCT h.district FROM TransportService h WHERE LOWER(h.state) = LOWER(:state) ORDER BY h.district ASC")
    List<String> findDistinctDistrictsByState(@Param("state") String state);

    @Query("""
                SELECT h FROM TransportService h
                WHERE
                (:search IS NULL OR :search = '' OR (
                    LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.contact) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.district) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.state) LIKE LOWER(CONCAT('%', :search, '%'))
                ))
                AND (:state IS NULL OR :state = '' OR LOWER(h.state) = LOWER(:state))
                AND (:district IS NULL OR :district = '' OR LOWER(h.district) = LOWER(:district))
            """)
    Page<TransportService> searchFiltered(@Param("search") String search,
            @Param("state") String state,
            @Param("district") String district,
            Pageable pageable);

    Optional<TransportService> findByUuid(String uuid);

    @Query("""
                SELECT ts FROM TransportService ts
                LEFT JOIN FETCH ts.vehicles
                WHERE ts.uuid = :uuid
            """)
    Optional<TransportService> findByUuidWithVehicles(@Param("uuid") String uuid);
}

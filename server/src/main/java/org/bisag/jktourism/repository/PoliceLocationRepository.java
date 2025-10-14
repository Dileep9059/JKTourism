package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.PoliceLocation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PoliceLocationRepository extends JpaRepository<PoliceLocation, Long> {

    @Query("""
                SELECT h FROM PoliceLocation h
                WHERE
                (:search IS NULL OR :search = '' OR (
                    LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.email) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.phone) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.district) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.state) LIKE LOWER(CONCAT('%', :search, '%'))
                ))
                AND (:state IS NULL OR :state = '' OR LOWER(h.state) = LOWER(:state))
                AND (:district IS NULL OR :district = '' OR LOWER(h.district) = LOWER(:district))
                AND (:name IS NULL OR :name = '' OR LOWER(h.name) = LOWER(:name))
            """)
    Page<PoliceLocation> searchFiltered(
            @Param("search") String search,
            @Param("state") String state,
            @Param("district") String district,
            @Param("name") String name,
            Pageable pageable);

    @Query("SELECT DISTINCT h.district FROM PoliceLocation h WHERE LOWER(h.state) = LOWER(:state) ORDER BY h.district ASC")
    List<String> findDistinctDistrictsByState(@Param("state") String state);

}

package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.HomeStay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HomeStayRepository extends JpaRepository<HomeStay, Long> {

    @Query("""
                SELECT h FROM HomeStay h
                WHERE
                (:search IS NULL OR :search = '' OR (
                    LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.address) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.contact) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.properitorName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.district) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.state) LIKE LOWER(CONCAT('%', :search, '%'))
                ))
                AND (:state IS NULL OR :state = '' OR LOWER(h.state) = LOWER(:state))
                AND (:district IS NULL OR :district = '' OR LOWER(h.district) = LOWER(:district))
            """)
    Page<HomeStay> searchFiltered(@Param("search") String search,
            @Param("state") String state,
            @Param("district") String district,
            Pageable pageable);

    @Query("SELECT DISTINCT h.district FROM HomeStay h WHERE LOWER(h.state) = LOWER(:state) ORDER BY h.district ASC")
    List<String> findDistinctDistrictsByState(@Param("state") String state);

}

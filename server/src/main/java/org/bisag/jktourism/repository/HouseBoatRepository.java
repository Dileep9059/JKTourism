package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.HouseBoat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HouseBoatRepository extends JpaRepository<HouseBoat, Long> {

    @Query("""
                SELECT h FROM HouseBoat h
                WHERE
                (:search IS NULL OR :search = '' OR (
                    LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.contact) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.properitorName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.category) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(h.location) LIKE LOWER(CONCAT('%', :search, '%'))
                ))
                AND (:location IS NULL OR :location = '' OR LOWER(h.location) = LOWER(:location))
                AND (:category IS NULL OR :category = '' OR LOWER(h.category) = LOWER(:category))
            """)
    Page<HouseBoat> searchFiltered(@Param("search") String search,
            @Param("location") String location,
            @Param("category") String category,
            Pageable pageable);

    @Query("SELECT DISTINCT h.category FROM HouseBoat h WHERE LOWER(h.location) = LOWER(:location) ORDER BY h.category ASC")
    List<String> findDistinctCategoriesByLocation(@Param("location") String location);

    @Query("SELECT DISTINCT h.location FROM HouseBoat h ORDER BY h.location ASC")
    List<String> findDistinctLocations();

}

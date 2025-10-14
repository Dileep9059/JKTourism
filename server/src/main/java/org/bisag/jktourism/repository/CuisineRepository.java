package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.Cuisine;
import org.bisag.jktourism.models.Destinations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;


public interface CuisineRepository  extends JpaRepository<Cuisine,Long>{
    List<Cuisine> findByDestinations(Destinations destination);

    /**
     * Finds an Cuisine entity by its URL value.
     *
     * @param urlValue the URL value to search for
     * @return the Cuisine entity with the given URL value, or null if not found
     */
    Cuisine findByUrlValue(String urlValue);

    /**
     * Updates the visibility of an Cuisine entity by its ID.
     * 
     * @param id the ID of the Cuisine entity to update
     * 
     */
    @Modifying
    @Transactional
    @Query(value = "UPDATE cuisine SET is_approved = NOT is_approved, updated_on = CURRENT_TIMESTAMP WHERE id = :id", nativeQuery = true)
    void toggleCuisineVisibilityById(@Param("id") Long id);
}

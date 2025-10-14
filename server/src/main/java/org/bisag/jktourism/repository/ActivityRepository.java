package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.Activity;
import org.bisag.jktourism.models.Destinations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByDestinations(Destinations destinations);

    List<Activity> findAllByIsApprovedTrue();

    /**
     * Finds an Activity entity by its URL value.
     *
     * @param urlValue the URL value to search for
     * @return the Activity entity with the given URL value, or null if not found
     */
    Activity findByUrlValue(String urlValue);

    /**
     * Updates the visibility of an Activity entity by its ID.
     * 
     * @param id the ID of the Activity entity to update
     * 
     */
    @Modifying
    @Transactional
    @Query(value = "UPDATE activity SET is_approved = NOT is_approved, updated_on = CURRENT_TIMESTAMP WHERE id = :id", nativeQuery = true)
    void toggleActivityVisibilityById(@Param("id") Long id);

}

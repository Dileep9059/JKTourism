package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.Shopping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ShoppingRepository extends JpaRepository<Shopping, Long> {

    /**
     * Finds a Shopping entity by its URL value.
     *
     * @param urlValue the URL value to search for
     * @return the Shopping entity with the given URL value, or null if not found
     */
    Shopping findByUrlValue(String urlValue);

    /**
     * Updates the visibility of a Shopping entity by its ID.
     * 
     * @param id the ID of the Shopping entity to update
     */
    @Modifying
    @Transactional
    @Query(value = "UPDATE shopping SET is_approved = NOT is_approved, updated_on = CURRENT_TIMESTAMP WHERE id = :id", nativeQuery = true)
    void toggleShoppingVisibilityById(@Param("id") Long id);

    /**
     * Retrieves a list of all Shopping entities that are approved.
     **/
    List<Shopping> findAllByIsApprovedTrue();

}

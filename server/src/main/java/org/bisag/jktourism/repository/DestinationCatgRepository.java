package org.bisag.jktourism.repository;

import java.util.List;
import java.util.Map;

import org.bisag.jktourism.models.DestinationCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface DestinationCatgRepository extends JpaRepository<DestinationCategory, Long> {

    boolean existsByName(String name);

    @Query(nativeQuery = true, value = "SELECT name, cover_image,url_value FROM destination_category WHERE is_approved = true ORDER BY name")
    List<Map<String, String>> getAllCategories();

    DestinationCategory findByName(String asText);

    DestinationCategory findByUrlValue(String asText);

    @Modifying
    @Transactional
    @Query(value = "UPDATE destination_category SET is_approved = NOT is_approved WHERE id = :id", nativeQuery = true)
    void updateCategoryVisibilityById(@Param("id") Long id);

}

package org.bisag.jktourism.repository;

import java.util.List;
import java.util.Map;

import org.bisag.jktourism.models.ExperienceGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExperienceGalleryRepository extends JpaRepository<ExperienceGallery, Long> {

    @Query(value = "SELECT image_url FROM experience_gallery WHERE experience_id = :experienceId", nativeQuery = true)
    List<String> findImageUrlByActivityId(Long experienceId);

    @Query(value = "SELECT image_url FROM experience_gallery WHERE experience_id = :experienceId ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    String getRandomImage(@Param("experienceId") Long experienceId);

    @Query(nativeQuery = true, value = "SELECT '' AS title, image_url as image FROM experience_gallery ORDER BY RANDOM() LIMIT 10")
    List<Map<String, String>> getSliderImages();

}

package org.bisag.jktourism.repository;

import java.util.List;
import java.util.Map;

import org.bisag.jktourism.models.Activity;
import org.bisag.jktourism.models.ActivityGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ActivityGalleryRepository extends JpaRepository<ActivityGallery, Long> {

    @Query(nativeQuery = true, value = "SELECT 'Title' AS title, image_url as image FROM activity_gallery WHERE file_type = 'IMAGE' ORDER BY RANDOM() LIMIT 10")
    List<Map<String, String>> getSliderImages();

    @Query(value = "SELECT image_url FROM activity_gallery WHERE activity_id = :activityId AND file_type = 'IMAGE' ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    String getRandomImage(@Param("activityId") Long activityId);

    @Query(value = "SELECT image_url FROM activity_gallery WHERE activity_id = :activityId AND file_type = 'IMAGE' ", nativeQuery = true)
    List<String> findImageUrlByActivityId(Long activityId);

    List<ActivityGallery> findByActivity(Activity activity);

}

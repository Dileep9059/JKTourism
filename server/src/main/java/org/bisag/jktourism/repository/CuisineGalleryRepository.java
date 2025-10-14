package org.bisag.jktourism.repository;

import java.util.List;
import java.util.Map;

import org.bisag.jktourism.models.CuisineGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CuisineGalleryRepository extends JpaRepository<CuisineGallery, Long>{
    @Query(nativeQuery = true, value = "SELECT 'Title' AS title, image_url as image FROM cuisine_gallery ORDER BY RANDOM() LIMIT 10")
    List<Map<String, String>> getSliderImages();

    @Query(value = "SELECT image_url FROM cuisine_gallery WHERE cuisine_id = :cuisineId ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    String getRandomImage(@Param("cuisineId") Long cuisineId);

    @Query(value = "SELECT image_url FROM cuisine_gallery WHERE cuisine_id = :cuisineId", nativeQuery = true)
    List<String> findImageUrlByCuisineId(Long cuisineId);
}

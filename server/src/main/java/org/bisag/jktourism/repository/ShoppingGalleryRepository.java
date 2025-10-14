package org.bisag.jktourism.repository;

import java.util.List;
import java.util.Map;

import org.bisag.jktourism.models.ShoppingGallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShoppingGalleryRepository extends JpaRepository<ShoppingGallery, Long> {

    /**
     * Finds a ShoppingGallery entity by its image URL.
     *
     * @param imageUrl the image URL to search for
     * @return the ShoppingGallery entity with the given image URL, or null if not
     *         found
     */
    ShoppingGallery findByImageUrl(String imageUrl);

    @Query(nativeQuery = true, value = "SELECT '' AS title, image_url as image FROM shopping_gallery ORDER BY RANDOM() LIMIT 10")
    List<Map<String, String>> getSliderImages();

    @Query(value = "SELECT image_url FROM shopping_gallery WHERE shopping_id = :shoppingId ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    String getRandomImage(@Param("shoppingId") Long shoppingId);

    @Query(value = "SELECT image_url FROM shopping_gallery WHERE shopping_id = :shoppingId", nativeQuery = true)
    List<String> findImageUrlByActivityId(Long shoppingId);

}

package org.bisag.jktourism.repository;

import java.util.List;
import java.util.Map;

import org.bisag.jktourism.models.DestinationCategory;
import org.bisag.jktourism.models.Destinations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DestinationsRepository extends JpaRepository<Destinations, Long> {

  List<Destinations> findByCategory(DestinationCategory category);

  List<Destinations> findByCategoryId(Long categoryId);

  boolean existsByTitle(String title);

  Destinations findByUrlValue(String urlValue);

  @Query(value = """
        SELECT des.id AS destination_id, des.title AS destination_title,des.description AS destination_description, des.url_value AS destination_url,
               dg.id AS gallery_id, dg.image_url AS gallery_image,dg.title AS gallery_title,dg.description AS gallery_description
        FROM destinations des
        LEFT JOIN destination_gallery dg
          ON dg.id = (
            SELECT MIN(dg2.id)
            FROM destination_gallery dg2
            WHERE dg2.destination_id = des.id
          )
        WHERE des.category_id = :categoryId
      """, nativeQuery = true)
  List<Map<String, Object>> findDestinationsWithFirstGallery(@Param("categoryId") Long categoryId);

  @Query("SELECT d.title AS name, d.urlValue FROM Destinations d WHERE d.category = :category")
  List<Object[]> getByCategory(@Param("category") DestinationCategory category);

}

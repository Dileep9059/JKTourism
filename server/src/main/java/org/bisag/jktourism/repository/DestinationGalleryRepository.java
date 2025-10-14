package org.bisag.jktourism.repository;

import java.util.List;
import java.util.Map;

import org.bisag.jktourism.models.DestinationGallery;
import org.bisag.jktourism.models.Destinations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DestinationGalleryRepository extends JpaRepository<DestinationGallery, Long> {

    List<DestinationGallery> findByDestination(Destinations destination);

    List<DestinationGallery> findByDestinationAndFileType(Destinations destination, String fileType);

    @Query(nativeQuery = true, value = "SELECT title, image_url as image FROM destination_gallery where file_type = 'IMAGE' ORDER BY RANDOM() LIMIT 10")
    List<Map<String, String>> getSliderImages();

}

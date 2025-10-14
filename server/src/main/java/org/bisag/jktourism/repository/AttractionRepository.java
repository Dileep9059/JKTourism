package org.bisag.jktourism.repository;

import org.bisag.jktourism.models.Attraction;
import org.bisag.jktourism.models.Destinations;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface AttractionRepository extends JpaRepository<Attraction,Long>{
    List<Attraction> findByDestination(Destinations destination);
}

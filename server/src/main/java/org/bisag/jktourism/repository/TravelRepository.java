package org.bisag.jktourism.repository;

import org.bisag.jktourism.models.Destinations;
import org.bisag.jktourism.models.Travel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface TravelRepository extends JpaRepository<Travel,Long>{
    
    List<Travel> findByDestination(Destinations destination);

}

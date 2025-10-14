package org.bisag.jktourism.repository;

import org.bisag.jktourism.models.Destinations;
import org.bisag.jktourism.models.WhichTime;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface WhichTimeRepository extends JpaRepository<WhichTime,Long>{

    List<WhichTime> findByDestination(Destinations destination);
    
}

package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.Destinations;
import org.bisag.jktourism.models.TravelTips;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelTipsRepository extends JpaRepository<TravelTips,Long>{
    
    List<TravelTips> findByDestination(Destinations destination);
}

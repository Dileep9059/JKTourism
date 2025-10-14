package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.Destinations;
import org.bisag.jktourism.models.WhyVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


public interface WhyVisitRepository  extends JpaRepository<WhyVisit,Long>{

     boolean existsByTitle(String title);

    @Query(nativeQuery = true, value = "SELECT name FROM destination_category ORDER BY name")
    List<String> getAllCategories();

    List<WhyVisit> findByDestination(Destinations destination);
}

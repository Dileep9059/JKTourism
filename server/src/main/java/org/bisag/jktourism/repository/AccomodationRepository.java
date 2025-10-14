package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.Accomodation;
import org.bisag.jktourism.models.Destinations;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccomodationRepository extends JpaRepository<Accomodation, Long> {
    List<Accomodation> findByDestination(Destinations destination);
}

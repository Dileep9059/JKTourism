package org.bisag.jktourism.repository.hotel;

import java.util.List;
import java.util.Optional;

import org.bisag.jktourism.models.hotel.Amenity;
import org.bisag.jktourism.models.hotel.enums.AmenityScope;
import org.bisag.jktourism.record.AmenityDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {
    Optional<Amenity> findByName(String name);

    @Query("""
                select new org.bisag.jktourism.record.AmenityDTO(a.id, a.name)
                from Amenity a
                where a.scope = :scope
            """)
    List<AmenityDTO> findByScope(@Param("scope") AmenityScope scope);

}

package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.TransportService;
import org.bisag.jktourism.models.TransportServiceVehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransportServiceVehicleRepository extends JpaRepository<TransportServiceVehicle, Long> {

    List<TransportServiceVehicle> findByTransportService(TransportService transportService);
    
}

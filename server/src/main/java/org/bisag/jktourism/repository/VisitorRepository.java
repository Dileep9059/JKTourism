package org.bisag.jktourism.repository;

import org.bisag.jktourism.models.Visitors;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitorRepository extends JpaRepository<Visitors, Long> {
    
}

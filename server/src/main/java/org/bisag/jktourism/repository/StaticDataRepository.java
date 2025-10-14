package org.bisag.jktourism.repository;

import org.bisag.jktourism.models.StaticData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaticDataRepository extends JpaRepository<StaticData, Long> {

    StaticData findByKey(String key);

}

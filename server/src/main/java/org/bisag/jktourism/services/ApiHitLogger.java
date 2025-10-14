package org.bisag.jktourism.services;

import java.time.LocalDateTime;

import org.bisag.jktourism.models.ApiHit;
import org.bisag.jktourism.repository.ApiHitRepository;
import org.springframework.stereotype.Service;

@Service
public class ApiHitLogger {

    private final ApiHitRepository apiHitRepository;

    public ApiHitLogger(ApiHitRepository apiHitRepository) {
        this.apiHitRepository = apiHitRepository;
    }

    public void log(String type, String category, String subCategory, String action, String userIdentifier) {
        ApiHit hit = new ApiHit();
        hit.setType(type);
        hit.setCategory(category);
        hit.setSubCategory(subCategory);
        hit.setAction(action);
        hit.setHitTime(LocalDateTime.now());
        hit.setUserIdentifier(userIdentifier);

        apiHitRepository.save(hit);
    }
}

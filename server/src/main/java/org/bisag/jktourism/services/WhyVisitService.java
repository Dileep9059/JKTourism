package org.bisag.jktourism.services;

import org.bisag.jktourism.repository.WhyVisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.bisag.jktourism.models.WhyVisit;

@Service
public class WhyVisitService {

    @Autowired
    WhyVisitRepository whyVisitRepository;

    public WhyVisit addWhyVisit(String whyVisit) {
        if (whyVisitRepository.existsByTitle(whyVisit)) {
            throw new IllegalArgumentException("Why visit already exists");
        }
        WhyVisit whyVi = new WhyVisit();
        whyVi.setTitle(whyVisit);
        return whyVisitRepository.save(whyVi);
    }

}

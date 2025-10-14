package org.bisag.jktourism.services;

import java.util.List;

import org.bisag.jktourism.models.TourGuide;
import org.bisag.jktourism.repository.TourGuideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class TourGuideService {
    @Autowired
    TourGuideRepository tourGuideRepository;

    public Page<TourGuide> getGuides(int page, int size, Sort sort, String search, String state, String district) {
        Pageable pageable = PageRequest.of(page, size, sort);

        if ((search != null && !search.isBlank()) || (state != null && !state.isBlank())
                || (district != null && !district.isBlank())) {
            return tourGuideRepository.searchFiltered(
                    search != null ? search.trim() : "",
                    state != null ? state.trim() : "",
                    district != null ? district.trim() : "",
                    pageable);
        } else {
            return tourGuideRepository.findAll(pageable);
        }
    }

    public List<String> getDistricts(String state) {
        return tourGuideRepository.findDistinctDistrictsByState(state);
    }

}

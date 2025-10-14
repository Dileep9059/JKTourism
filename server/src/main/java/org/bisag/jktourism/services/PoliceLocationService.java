package org.bisag.jktourism.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bisag.jktourism.models.PoliceLocation;
import org.bisag.jktourism.repository.PoliceLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class PoliceLocationService {
    @Autowired
    PoliceLocationRepository policeLocationRepository;

    public Page<PoliceLocation> getPoliceLocations(int page, int size, Sort sort, String search, String state,
            String district, String name) {
        Map<String, String> searchParams = new HashMap<>();
        searchParams.put("reception", "Director Tourism Kashmir,Tourist Reception");
        searchParams.put("commissioner", "Office of Deputy Commissioner");
        searchParams.put("superintendent", "Office of Superintendent of Police");

        return policeLocationRepository.searchFiltered(search, state, district, searchParams.get(name),
                PageRequest.of(page, size, sort));
    }

    public List<String> getDistricts(String state) {
        return policeLocationRepository.findDistinctDistrictsByState(state);
    }

}

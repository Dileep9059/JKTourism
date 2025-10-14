package org.bisag.jktourism.services;

import java.util.List;

import org.bisag.jktourism.models.HouseBoat;
import org.bisag.jktourism.repository.HouseBoatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class HouseBoatService {
    @Autowired
    HouseBoatRepository houseboatRepository;

    public Page<HouseBoat> getHouseBoats(int page, int size, Sort sort, String search, String category, String location) {
        Pageable pageable = PageRequest.of(page, size, sort);

        if ((search != null && !search.isBlank()) || (category != null && !category.isBlank())
                || (location != null && !location.isBlank())) {
            return houseboatRepository.searchFiltered(
                    search != null ? search.trim() : "",
                    location != null ? location.trim() : "",
                    category != null ? category.trim() : "",
                    pageable);
        } else {
            return houseboatRepository.findAll(pageable);
        }
    }

    public List<String> getLocations() {
        return houseboatRepository.findDistinctLocations();
    }

    public List<String> getCategories(String location){
        return houseboatRepository.findDistinctCategoriesByLocation(location);
    }
}

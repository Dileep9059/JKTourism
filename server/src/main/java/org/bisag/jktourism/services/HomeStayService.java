package org.bisag.jktourism.services;

import java.util.List;

import org.bisag.jktourism.models.HomeStay;
import org.bisag.jktourism.repository.HomeStayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class HomeStayService {

    @Autowired
    HomeStayRepository homeStayRepository;

    public Page<HomeStay> getStays(int page, int size, Sort sort, String search,String state, String district) {
        Pageable pageable = PageRequest.of(page, size, sort);

        if ((search != null && !search.isBlank()) || (state != null && !state.isBlank())
                || (district != null && !district.isBlank())) {
            return homeStayRepository.searchFiltered(
                    search != null ? search.trim() : "",
                    state != null ? state.trim() : "",
                    district != null ? district.trim() : "",
                    pageable);
        } else {
            return homeStayRepository.findAll(pageable);
        }
    }

    public List<String> getDistricts(String state) {
        return homeStayRepository.findDistinctDistrictsByState(state);
    }
}

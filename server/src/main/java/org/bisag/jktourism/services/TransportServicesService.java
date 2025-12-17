package org.bisag.jktourism.services;

import java.util.List;

import org.bisag.jktourism.models.TransportService;
import org.bisag.jktourism.repository.TransportServiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransportServicesService {
    private final TransportServiceRepository transportServiceRepository;

    public Page<TransportService> getGuides(int page, int size, Sort sort, String search, String state, String district) {
        Pageable pageable = PageRequest.of(page, size, sort);

        if ((search != null && !search.isBlank()) || (state != null && !state.isBlank())
                || (district != null && !district.isBlank())) {
            return transportServiceRepository.searchFiltered(
                    search != null ? search.trim() : "",
                    state != null ? state.trim() : "",
                    district != null ? district.trim() : "",
                    pageable);
        } else {
            return transportServiceRepository.findAll(pageable);
        }
    }

    public List<String> getDistricts(String state) {
        return transportServiceRepository.findDistinctDistrictsByState(state);
    }
}

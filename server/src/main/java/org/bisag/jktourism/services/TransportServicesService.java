package org.bisag.jktourism.services;

import java.util.List;

import org.bisag.jktourism.models.TransportService;
import org.bisag.jktourism.payload.response.TransportServiceDetailsDTO;
import org.bisag.jktourism.payload.response.VehicleDTO;
import org.bisag.jktourism.repository.TransportServiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransportServicesService {
    private final TransportServiceRepository transportServiceRepository;

    public Page<TransportService> getTransportServices(int page, int size, Sort sort, String search, String state,
            String district) {
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

    @Transactional(readOnly = true)
    public TransportServiceDetailsDTO getTransportServiceDetails(String uuid) {
        TransportService ts = transportServiceRepository.findByUuidWithVehicles(uuid)
                .orElseThrow(() -> new RuntimeException("Transport service not found"));

        TransportServiceDetailsDTO dto = new TransportServiceDetailsDTO();
        dto.setUuid(ts.getUuid());
        dto.setName(ts.getName());
        dto.setLocation(ts.getLocation());
        dto.setDistrict(ts.getDistrict());
        dto.setState(ts.getState());
        dto.setEmail(ts.getEmail());
        dto.setContact(ts.getContact());
        dto.setRegistrationDetail(ts.getRegistrationDetail());

        List<VehicleDTO> vehicles = ts.getVehicles().stream()
                .map(v -> {
                    VehicleDTO vd = new VehicleDTO();
                    vd.setUuid(v.getUuid());
                    vd.setVehicleNumber(v.getVehicleNumber());
                    vd.setVehicleType(v.getVehicleType());
                    vd.setCapacity(v.getCapacity());
                    vd.setRate(v.getRate());
                    return vd;
                })
                .toList();

        dto.setVehicles(vehicles);
        return dto;
    }
}

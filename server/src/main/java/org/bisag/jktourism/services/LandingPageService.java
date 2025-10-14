package org.bisag.jktourism.services;

import java.util.List;
import java.util.Map;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.repository.DestinationGalleryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LandingPageService {

    @Autowired
    Crypto crypto;

    @Autowired
    DestinationGalleryRepository destinationGalleryRepository;

    public List<Map<String, String>> getSliderImages() {
        return destinationGalleryRepository.getSliderImages().stream().map(row -> {
            try {
                return Map.of(
                        "image", crypto.encrypt(row.get("image")).replaceAll("/", "-"),
                        "title", row.get("title"));
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }).toList();
    }
}

package org.bisag.jktourism.services;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.models.Experience;
import org.bisag.jktourism.models.ExperienceGallery;
import org.bisag.jktourism.repository.ExperienceGalleryRepository;
import org.bisag.jktourism.repository.ExperienceRepository;
import org.bisag.jktourism.services.FileValidation.ImageValidationService;
import org.bisag.jktourism.utils.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ExperienceService {

    @Value("${mediaPath}")
    String mediaPath;

    @Autowired
    Utility utility;

    @Autowired
    private ImageValidationService imageValidationService;

    @Autowired
    FileService fileService;

    @Autowired
    Crypto crypto;

    @Autowired
    ExperienceRepository experienceRepository;

    @Autowired
    ExperienceGalleryRepository experienceGalleryRepository;

    public void createExperience(Experience experience, MultipartFile[] files) throws Exception {

        try {
            // changing activity title into camcel case
            experience.setTitle(utility.toTitleCase(experience.getTitle()));

            Experience savdExperience = experienceRepository.save(experience);

            // loop through files and save those
            for (MultipartFile file : files) {
                // validate image
                imageValidationService.validateImage(file);

                String extension = utility.getFileExtensionWithDot(file.getOriginalFilename());
                String fileDir = mediaPath + File.separator + utility.generateYearMonth()
                        + File.separator + "experience" + File.separator + savdExperience.getUrlValue() + File.separator
                        + "Images";
                String fileName = utility.generateUniqueNumber() + extension;
                boolean isSaved = fileService.uploadFile(fileDir, fileName, file);
                if (isSaved) {
                    ExperienceGallery gallery = new ExperienceGallery();
                    gallery.setExperience(savdExperience);
                    gallery.setImageUrl(fileDir + File.separator + fileName);
                    experienceGalleryRepository.save(gallery);

                } else {
                    throw new IllegalArgumentException("Error saving experience");
                }
            }

        } catch (Exception e) {
            throw new IllegalArgumentException("Error creating experience: " + e.getLocalizedMessage());
        }
    }

    public Map<String, Object> getExperience(String urlValue) {
        Experience experience = experienceRepository.findByUrlValue(urlValue);
        return Map.of("experience", experience,
                "images", experienceGalleryRepository.findImageUrlByActivityId(experience.getId()).stream().map(row -> {
                    try {
                        return crypto.encrypt(row);
                    } catch (Exception e) {
                        return null;
                    }
                }));
    }

    public Page<Experience> getExperiences(int page, int size, Sort sort) {
        return experienceRepository.findAll(PageRequest.of(page, size, sort));
    }

    public void updateStatus(Long id) {
        try {
            experienceRepository.toggleExperienceVisibilityById(id);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error updating category status: " + e.getLocalizedMessage());
        }
    }

    public List<Map<String, String>> getSliderImages() {
        List<Map<String, String>> sliderImages = experienceGalleryRepository.getSliderImages().stream().map(row -> {
            try {
                Map<String, String> temp = Map.of("title", row.get("title"),
                        "image", crypto.encrypt(row.get("image")));

                return temp;
            } catch (Exception e) {
                return null;
            }
        }).toList();
        return sliderImages;
    }

    public List<Map<String, String>> fetchExperiences() {
        try {
            return experienceRepository.findAllByIsApprovedTrue().stream().map(activity -> {
                try {
                    Map<String, String> map = new HashMap<>();
                    map.put("cover_image",
                            crypto.encrypt(experienceGalleryRepository.getRandomImage(activity.getId())));
                    map.put("name", activity.getTitle());
                    map.put("url_value", activity.getUrlValue());
                    return map;
                } catch (Exception e) {
                    return null;
                }
            }).toList();
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException("Error adding destination: " + e.getLocalizedMessage());
        }
    }
}

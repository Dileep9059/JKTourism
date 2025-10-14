package org.bisag.jktourism.services;

import java.io.File;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Stream;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.models.Activity;
import org.bisag.jktourism.models.ActivityGallery;
import org.bisag.jktourism.repository.ActivityGalleryRepository;
import org.bisag.jktourism.repository.ActivityRepository;
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
public class ActivityService {

    @Value("${mediaPath}")
    String mediaPath;

    @Autowired
    Utility utility;

    @Autowired
    private ImageValidationService imageValidationService;

    @Autowired
    ActivityRepository activityRepository;

    @Autowired
    FileService fileService;

    @Autowired
    ActivityGalleryRepository activityGalleryRepository;

    @Autowired
    Crypto crypto;

    public void createActivity(Activity activity, MultipartFile[] files) throws Exception {

        try {
            // changing activity title into camcel case
            activity.setTitle(utility.toTitleCase(activity.getTitle()));

            Activity savdActivity = activityRepository.save(activity);

            // loop through files and save those
            for (MultipartFile file : files) {
                // validate image
                imageValidationService.validateImage(file);

                String extension = utility.getFileExtensionWithDot(file.getOriginalFilename());
                String fileDir = mediaPath + File.separator + utility.generateYearMonth()
                        + File.separator + "activity" + File.separator + savdActivity.getUrlValue() + File.separator
                        + "Images";
                String fileName = utility.generateUniqueNumber() + extension;
                boolean isSaved = fileService.uploadFile(fileDir, fileName, file);
                if (isSaved) {
                    ActivityGallery gallery = new ActivityGallery();
                    gallery.setActivity(savdActivity);
                    gallery.setImageUrl(fileDir + File.separator + fileName);
                    activityGalleryRepository.save(gallery);

                } else {
                    throw new IllegalArgumentException("Error saving event");
                }
            }

        } catch (Exception e) {
            throw new IllegalArgumentException("Error creating event: " + e.getLocalizedMessage());
        }
    }

    public Page<Activity> getActivities(int page, int size, Sort sort) {
        return activityRepository.findAll(PageRequest.of(page, size, sort));
    }

    public List<Map<String, String>> getSliderImages() {
        List<Map<String, String>> sliderImages = activityGalleryRepository.getSliderImages().stream().map(row -> {
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

    public Map<String, Stream<Object>> fetchActivities() {
        try {
            return Map.of("destinations",
                    activityRepository.findAllByIsApprovedTrue().stream().map(activity -> {
                        try {
                            Map<String, String> map = new HashMap<>();
                            map.put("gallery_image",
                                    crypto.encrypt(activityGalleryRepository.getRandomImage(activity.getId())));
                            map.put("destination_title", activity.getTitle());
                            map.put("destination_description", activity.getDescription());
                            map.put("destination_url", activity.getUrlValue());
                            map.put("gallery_title", activity.getUrlValue());
                            return map;
                        } catch (Exception e) {
                            return null;
                        }
                    }));
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException(e.getMessage());
        }
    }

    public Map<String, Object> getActivity(String urlValue) {
        Activity activity = activityRepository.findByUrlValue(urlValue);
        return Map.of("activity", activity,
                "images", activityGalleryRepository.findImageUrlByActivityId(activity.getId()).stream().map(row -> {
                    try {
                        return crypto.encrypt(row);
                    } catch (Exception e) {
                        return null;
                    }
                }),
                "brochures", activityGalleryRepository.findByActivity(activity).stream().map(row -> {
                    try {
                        if (row.getFileType().equals("BROCHURE") && row.getImageUrl() != null && !row.getImageUrl().isEmpty()) {
                            Map<String, Object> temp = new HashMap<>();
                            temp.put("title", row.getTitle());
                            temp.put("file", URLEncoder.encode(crypto.encrypt(row.getImageUrl()), "UTF-8"));
                            return temp;
                        }
                        return null;
                    } catch (Exception e) {
                        return null;
                    }
                }).filter(Objects::nonNull));
    }

    public void updateStatus(Long id) {
        try {
            activityRepository.toggleActivityVisibilityById(id);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error updating category status: " + e.getLocalizedMessage());
        }
    }
}
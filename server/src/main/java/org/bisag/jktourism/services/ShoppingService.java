package org.bisag.jktourism.services;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.models.Experience;
import org.bisag.jktourism.models.Shopping;
import org.bisag.jktourism.models.ShoppingGallery;
import org.bisag.jktourism.repository.ShoppingGalleryRepository;
import org.bisag.jktourism.repository.ShoppingRepository;
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
public class ShoppingService {

    @Autowired
    Crypto crypto;

    @Autowired
    FileService fileService;

    @Value("${mediaPath}")
    String mediaPath;

    @Autowired
    Utility utility;

    @Autowired
    private ImageValidationService imageValidationService;

    @Autowired
    ShoppingGalleryRepository shoppingGalleryRepository;

    @Autowired
    ShoppingRepository shoppingRepository;

    public void createShopping(Shopping shopping, MultipartFile[] files) throws Exception {

        try {
            // changing activity title into camcel case
            shopping.setTitle(utility.toTitleCase(shopping.getTitle()));

            Shopping savedShopping = shoppingRepository.save(shopping);

            // loop through files and save those
            for (MultipartFile file : files) {
                // validate image
                imageValidationService.validateImage(file);

                String extension = utility.getFileExtensionWithDot(file.getOriginalFilename());
                String fileDir = mediaPath + File.separator + utility.generateYearMonth()
                        + File.separator + "shopping" + File.separator + savedShopping.getUrlValue() + File.separator
                        + "Images";
                String fileName = utility.generateUniqueNumber() + extension;
                boolean isSaved = fileService.uploadFile(fileDir, fileName, file);
                if (isSaved) {
                    ShoppingGallery gallery = new ShoppingGallery();
                    gallery.setShopping(savedShopping);
                    gallery.setImageUrl(fileDir + File.separator + fileName);
                    shoppingGalleryRepository.save(gallery);

                } else {
                    throw new IllegalArgumentException("Error saving shopping");
                }
            }

        } catch (Exception e) {
            throw new IllegalArgumentException("Error creating shopping: " + e.getLocalizedMessage());
        }
    }

    public Page<Shopping> getAllShopping(int page, int size, Sort sort) {
        return shoppingRepository.findAll(PageRequest.of(page, size, sort));
    }

    public void updateStatus(Long id) {
        try {
            shoppingRepository.toggleShoppingVisibilityById(id);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error updating category status: " + e.getLocalizedMessage());
        }
    }

    public List<Map<String, String>> getSliderImages() {
        List<Map<String, String>> sliderImages = shoppingGalleryRepository.getSliderImages().stream().map(row -> {
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

    public List<Map<String, String>> fetchShoppingLocations() {
        try {
            return shoppingRepository.findAllByIsApprovedTrue().stream().map(activity -> {
                try {
                    Map<String, String> map = new HashMap<>();
                    map.put("cover_image",
                            crypto.encrypt(shoppingGalleryRepository.getRandomImage(activity.getId())));
                    map.put("name", activity.getTitle());
                    map.put("url_value", activity.getUrlValue());
                    return map;
                } catch (Exception e) {
                    return null;
                }
            }).toList();
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException("Error: " + e.getLocalizedMessage());
        }
    }

    public Map<String, Object> getShoppingLocation(String urlValue) {
        Shopping shopping = shoppingRepository.findByUrlValue(urlValue);
        return Map.of("shopping", shopping,
                "images", shoppingGalleryRepository.findImageUrlByActivityId(shopping.getId()).stream().map(row -> {
                    try {
                        return crypto.encrypt(row);
                    } catch (Exception e) {
                        return null;
                    }
                }));
    }

}

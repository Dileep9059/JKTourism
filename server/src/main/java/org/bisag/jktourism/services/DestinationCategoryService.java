package org.bisag.jktourism.services;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.models.DestinationCategory;
import org.bisag.jktourism.repository.DestinationCatgRepository;
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
public class DestinationCategoryService {

    @Autowired
    Crypto crypto;

    @Autowired
    DestinationCatgRepository destinationCategoryRepository;

    @Autowired
    FileService fileService;

    @Value("${mediaPath}")
    String mediaPath;

    @Autowired
    Utility utility;

    @Autowired
    private ImageValidationService imageValidationService;

    public void addCategory(String categoryName, MultipartFile file) {
        if (destinationCategoryRepository.existsByName(categoryName)) {
            throw new IllegalArgumentException("Category already exists");
        }
        try {
            // validating thr image file
            imageValidationService.validateImage(file);
            DestinationCategory category = new DestinationCategory();
            category.setName(categoryName);
          //  category.setUrlValue(categoryName.replace("", "_"));
            category.setCoverImageName(file.getOriginalFilename());

            // extract image file extension
            String extension = utility.getFileExtensionWithDot(file.getOriginalFilename());

            String fileDir = mediaPath + File.separator + utility.generateYearMonth() + File.separator + "category"
                    + File.separator + categoryName.replaceAll("\\s", "")
                    + File.separator + "CoverImages";
            String fileName = utility.generateUniqueNumber() + extension;
            // saving the image
            boolean isSaved = fileService.uploadFile(fileDir, fileName, file);

            if (isSaved) {
                category.setCoverImage(fileDir + File.separator + fileName);
                destinationCategoryRepository.save(category);

            } else {
                throw new IllegalArgumentException("Error saving image");
            }

        } catch (Exception e) {
            throw new IllegalArgumentException("Error adding category: " + e.getLocalizedMessage());
        }
    }

    public Page<DestinationCategory> getCategories(int page, int size, Sort sort) throws Exception {
        return destinationCategoryRepository.findAll(PageRequest.of(page, size,
                sort)).map(category -> {
                    try {
                        category.setCoverImage(crypto.encrypt(category.getCoverImage()));
                    } catch (Exception e) {
                        throw new IllegalArgumentException("Error while fetching categories.");
                    }
                    return category;
                });
    }

    public List<Map<String, String>> getAllCategories() {

        // return destinationCategoryRepository.getAllCategories().stream().map(row -> {
        // try {
        // row.put("cover_image", crypto.encrypt(row.get("cover_image").toString()));
        // } catch (Exception e) {
        // throw new IllegalArgumentException("Error while fetching categories.");
        // }
        // return row;
        // }).toList();

        return destinationCategoryRepository.getAllCategories().stream().map(row -> {
            try {
                
                Map<String, String> map = new HashMap<>();
                map.put("cover_image", crypto.encrypt(row.get("cover_image")));
                map.put("name", row.get("name")); // include other fields as needed
                map.put("url_value", row.get("url_value").toString());
                return map;
            } catch (Exception e) {
                throw new IllegalArgumentException("Error while fetching categories.");
            }
        }).toList();

    }

    public List<DestinationCategory> getListOfCategories() {
        return destinationCategoryRepository.findAll();
    }


    // Update the visibility of a category
    public void updateCategory(Long id) {
        try {
            destinationCategoryRepository.updateCategoryVisibilityById(id);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error updating category status: " + e.getLocalizedMessage());
        }
    }


}

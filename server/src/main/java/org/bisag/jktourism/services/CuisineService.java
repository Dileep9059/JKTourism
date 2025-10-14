package org.bisag.jktourism.services;

import java.io.File;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.models.Activity;
import org.bisag.jktourism.models.ActivityGallery;
import org.bisag.jktourism.models.Cuisine;
import org.bisag.jktourism.models.CuisineGallery;
import org.bisag.jktourism.repository.CuisineGalleryRepository;
import org.bisag.jktourism.repository.CuisineRepository;
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
public class CuisineService {

    @Value("${mediaPath}")
    String mediaPath;

    @Autowired
    Utility utility;

    @Autowired
    private ImageValidationService imageValidationService;

    @Autowired
    CuisineRepository cuisineRepository;

    @Autowired
    FileService fileService;

    @Autowired
    CuisineGalleryRepository cuisineGalleryRepository;

    @Autowired
    Crypto crypto;

    public void createCuisine(Cuisine cuisine, MultipartFile[] files) throws Exception {
        try {
            cuisine.setTitle(utility.toTitleCase(cuisine.getTitle()));

            Cuisine savedCuisine = cuisineRepository.save(cuisine);

            for (MultipartFile file : files) {
                imageValidationService.validateImage(file);

                String extension = utility.getFileExtensionWithDot(file.getOriginalFilename());
                String fileDir = mediaPath + File.separator + utility.generateYearMonth()
                        + File.separator + "cuisine" + File.separator + savedCuisine.getUrlValue() + File.separator
                        + "Images";
                String fileName = utility.generateUniqueNumber() + extension;
                boolean isSaved = fileService.uploadFile(fileDir, fileName, file);
                if (isSaved) {
                    CuisineGallery gallery = new CuisineGallery();
                    gallery.setCuisine(savedCuisine);
                    gallery.setImageUrl(fileDir + File.separator + fileName);
                    cuisineGalleryRepository.save(gallery);

                } else {
                    throw new IllegalArgumentException("Error saving cuisine");
                }
            }

        } catch (Exception e) {
            throw new IllegalArgumentException("Error creating cuisine: " + e.getLocalizedMessage());
        }
    }

    public Page<Cuisine> getCuisines(int page, int size, Sort sort) {
        return cuisineRepository.findAll(PageRequest.of(page, size, sort));
    }

    public void updateStatus(Long id) {
        try {
            cuisineRepository.toggleCuisineVisibilityById(id);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error updating cuisine status: " + e.getLocalizedMessage());
        }
    }
}

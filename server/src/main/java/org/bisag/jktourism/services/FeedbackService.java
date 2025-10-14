package org.bisag.jktourism.services;

import java.io.File;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.models.Destinations;
import org.bisag.jktourism.models.Feedback;
import org.bisag.jktourism.repository.DestinationsRepository;
import org.bisag.jktourism.repository.FeedbackRepository;
import org.bisag.jktourism.services.FileValidation.ImageValidationService;
import org.bisag.jktourism.utils.Json;
import org.bisag.jktourism.utils.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;

@Service
public class FeedbackService {

    @Value("${mediaPath}")
    String mediaPath;

    @Autowired
    Utility utility;

    @Autowired
    Crypto crypto;

    @Autowired
    FileService fileService;

    @Autowired
    FeedbackRepository feedbackRepository;

    @Autowired
    DestinationsRepository destinationsRepository;

    @Autowired
    private ImageValidationService imageValidationService;

    public void saveFeedback(String data, MultipartFile file) throws Exception {
        JsonNode json = Json.deserialize(JsonNode.class, data);
        try {
            imageValidationService.validateImage(file);
            String extension = utility.getFileExtensionWithDot(file.getOriginalFilename());

            String fileDir = mediaPath + File.separator + utility.generateYearMonth() + File.separator + "feedback"
                    + File.separator + utility.generateUniqueNumber();

            String fileName = utility.generateUniqueNumber() + extension;
            // saving the image
            boolean isSaved = fileService.uploadFile(fileDir, fileName, file);

            if (isSaved) {
                Feedback feedback = new Feedback();
                feedback.setName(json.get("name").asText());
                feedback.setEmail(json.get("email").asText());
                feedback.setContent(json.get("content").asText());
                feedback.setRating(json.get("rating").asInt());

                Destinations destination = destinationsRepository.findByUrlValue(json.get("location").asText());

                feedback.setDestination(destination);

                feedback.setImage(fileDir + File.separator + fileName);
                feedbackRepository.save(feedback);

            } else {
                throw new IllegalArgumentException("Error saving image");
            }
        } catch (Exception e) {
            throw new Exception("Failed to save feedback");
        }
    }

    public Page<Feedback> getFeedbacks(int page, int size, Sort sort) {
        return feedbackRepository.findAll(PageRequest.of(page, size,
                sort)).map(feedback -> {
                    try {
                        feedback.setImage(crypto.encrypt(feedback.getImage()));
                    } catch (Exception e) {
                        throw new IllegalArgumentException("Error while fetching categories.");
                    }
                    return feedback;
                });
    }

    public void updateStatus(Long id) {
        Feedback feedback = feedbackRepository.findById(id).orElse(null);
        if (feedback != null) {
            feedback.setActive(!feedback.isActive());
            feedbackRepository.save(feedback);
        }
    }

    public List<Map<String, Object>> getPublicFeedbacks() {
        return feedbackRepository.findAllByIsActiveTrue().stream().map(feedback -> {
            try {
                Map<String, Object> temp = new HashMap<>();
                temp.put("image", URLEncoder.encode(crypto.encrypt(feedback.getImage()), "UTF-8"));
                temp.put("name", feedback.getName());
                temp.put("destination",
                        feedback.getDestination() != null ? feedback.getDestination().getTitle() : "Overall");
                temp.put("rating", feedback.getRating());
                temp.put("content", feedback.getContent());
                return temp;
            } catch (Exception e) {
                throw new IllegalArgumentException("Error while fetching public feedbacks.");
            }
        }).toList();
    }

    public List<Map<String, Object>> getMyFeedbacks(String username) {
        return feedbackRepository.findAllByEmailAndIsActiveTrue(username).stream().map(feedback -> {
            try {
                Map<String, Object> temp = new HashMap<>();
                temp.put("image", URLEncoder.encode(crypto.encrypt(feedback.getImage()), "UTF-8"));
                temp.put("name", feedback.getName());
                temp.put("destination", feedback.getDestination().getTitle());
                temp.put("rating", feedback.getRating());
                temp.put("content", feedback.getContent());
                return temp;
            } catch (Exception e) {
                throw new IllegalArgumentException("Error while fetching my feedbacks.");
            }
        }).toList();
    }

}

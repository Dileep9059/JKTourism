package org.bisag.jktourism.services;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.models.Accomodation;
import org.bisag.jktourism.models.Activity;
import org.bisag.jktourism.models.ActivityGallery;
import org.bisag.jktourism.models.Attraction;
import org.bisag.jktourism.models.DestinationCategory;
import org.bisag.jktourism.models.DestinationGallery;
import org.bisag.jktourism.models.Destinations;
import org.bisag.jktourism.models.Travel;
import org.bisag.jktourism.models.TravelTips;
import org.bisag.jktourism.models.WhichTime;
import org.bisag.jktourism.models.WhyVisit;
import org.bisag.jktourism.repository.AccomodationRepository;
import org.bisag.jktourism.repository.ActivityGalleryRepository;
import org.bisag.jktourism.repository.ActivityRepository;
import org.bisag.jktourism.repository.AttractionRepository;
import org.bisag.jktourism.repository.CuisineRepository;
import org.bisag.jktourism.repository.DestinationCatgRepository;
import org.bisag.jktourism.repository.DestinationGalleryRepository;
import org.bisag.jktourism.repository.DestinationsRepository;
import org.bisag.jktourism.repository.FeedbackRepository;
import org.bisag.jktourism.repository.TravelRepository;
import org.bisag.jktourism.repository.TravelTipsRepository;
import org.bisag.jktourism.repository.WhichTimeRepository;
import org.bisag.jktourism.repository.WhyVisitRepository;
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
public class DestinationService {

  @Autowired
  DestinationsRepository destinationsRepository;

  @Autowired
  DestinationCatgRepository destinationCatgRepository;

  @Autowired
  WhyVisitRepository whyVisitRepository;

  @Autowired
  AttractionRepository attractionRepository;

  @Autowired
  CuisineRepository cuisineRepository;

  @Autowired
  TravelTipsRepository travelTipsRepository;

  @Autowired
  TravelRepository travelRepository;

  @Autowired
  AccomodationRepository accomodationRepository;

  @Autowired
  WhichTimeRepository whichTimeRepository;

  @Autowired
  ActivityRepository activityRepository;

  @Autowired
  FileService fileService;

  @Value("${mediaPath}")
  String mediaPath;

  @Autowired
  Utility utility;

  @Autowired
  DestinationGalleryRepository destinationGalleryRepository;

  @Autowired
  ActivityGalleryRepository activityGalleryRepository;

  @Autowired
  Crypto crypto;

  @Autowired
  FeedbackRepository feedbackRepository;

  public void addDestination(JsonNode destinationData, Map<String, String> metadata, MultipartFile[] files) {

    if (destinationsRepository.existsByTitle(destinationData.get("title").asText())) {
      throw new IllegalArgumentException("Destination already exists");
    }
    try {

      DestinationCategory destCat = destinationCatgRepository.findByName(destinationData.get("category").asText());

      Destinations destination = new Destinations();
      destination.setCategory(destCat);
      destination.setTitle(destinationData.get("title").asText());
      destination.setDescription(destinationData.get("description").asText());
      destination.setContent(destinationData.get("content").asText());

      // WhyVisits
      if (destinationData.has("whyVisits")) {

        JsonNode whyVisitsNode = destinationData.get("whyVisits");
        for (JsonNode w : whyVisitsNode) {
          String title = w.path("title").asText().trim();
          String description = w.path("description").asText().trim();
          if (!title.isEmpty() && !description.isEmpty()) {
            WhyVisit visit = new WhyVisit();
            visit.setTitle(w.path("title").asText());
            visit.setDescription(w.path("description").asText());
            visit.setDestination(destination);
            destination.getWhyVisits().add(visit);

          }
        }
      }

      if (destinationData.has("nearByAttractions")) {

        // NearbyAttractions
        JsonNode nearByNode = destinationData.get("nearByAttractions");
        for (JsonNode n : nearByNode) {
          String title = n.path("title").asText().trim();
          String description = n.path("description").asText().trim();
          if (!title.isEmpty() && !description.isEmpty()) {
            Attraction attraction = new Attraction();
            attraction.setTitle(n.path("title").asText());
            attraction.setDescription(n.path("description").asText());
            attraction.setDestination(destination);
            destination.getAttractions().add(attraction);

          }
        }
      }

      if (destinationData.has("travelTips")) {
        JsonNode travelTipsNode = destinationData.get("travelTips");
        for (JsonNode n : travelTipsNode) {
          String title = n.path("title").asText().trim();
          String description = n.path("description").asText().trim();
          if (!title.isEmpty() && !description.isEmpty()) {
            TravelTips travelTips = new TravelTips();
            travelTips.setTitle(n.path("title").asText());
            travelTips.setDescription(n.path("description").asText());
            travelTips.setDestination(destination);
            destination.getTravelTips().add(travelTips);

          }
        }
      }

      if (destinationData.has("travel")) {
        JsonNode travelNode = destinationData.get("travel");
        for (JsonNode n : travelNode) {
          String title = n.path("title").asText().trim();
          String description = n.path("description").asText().trim();
          if (!title.isEmpty() && !description.isEmpty()) {
            Travel travel = new Travel();
            travel.setTitle(n.path("title").asText());
            travel.setDescription(n.path("description").asText());
            travel.setDestination(destination);
            destination.getTravel().add(travel);

          }
        }
      }

      if (destinationData.has("accomodation")) {
        JsonNode accomodationNode = destinationData.get("accomodation");
        for (JsonNode n : accomodationNode) {
          String title = n.path("title").asText().trim();
          String description = n.path("description").asText().trim();

          // only add if both title and description are not empty
          if (!title.isEmpty() && !description.isEmpty()) {
            Accomodation accomodation = new Accomodation();
            accomodation.setTitle(title);
            accomodation.setDescription(description);
            accomodation.setDestination(destination);
            destination.getAccomodation().add(accomodation);
          }

        }
      }

      if (destinationData.has("whichTime")) {
        JsonNode whichTimeNode = destinationData.get("whichTime");
        for (JsonNode n : whichTimeNode) {
          String title = n.path("title").asText().trim();
          String description = n.path("description").asText().trim();
          if (!title.isEmpty() && !description.isEmpty()) {
            WhichTime whichTime = new WhichTime();
            whichTime.setTitle(n.path("title").asText());
            whichTime.setDescription(n.path("description").asText());
            whichTime.setDestination(destination);
            destination.getWhichTime().add(whichTime);

          }
        }
      }

      for (int i = 0; i < files.length; i++) {
        MultipartFile file = files[i];

        String title = Json.deserialize(String.class, metadata.get("metadata[" + i + "][title]"));
        String description = Json.deserialize(String.class, metadata.get("metadata[" + i + "][description]"));

        DestinationGallery image = new DestinationGallery();
        image.setTitle(title);
        image.setDescription(description);

        // extract image file extension
        String extension = utility.getFileExtensionWithDot(file.getOriginalFilename());

        String fileDir = mediaPath
            + File.separator + utility.generateYearMonth()
            + File.separator + "category"
            + File.separator + destCat.getUrlValue()
            + File.separator + Arrays.stream(
                destinationData.get("title").asText().trim()
                    .split("[^a-zA-Z0-9]+"))
                .filter(word -> !word.isEmpty())
                .map(word -> Character.toUpperCase(word.charAt(0)) + word.substring(1).toLowerCase())
                .collect(Collectors.joining())
            + File.separator + "Images";
        String fileName = utility.generateUniqueNumber() + extension;
        // saving the image
        boolean isSaved = fileService.uploadFile(fileDir, fileName, file);

        image.setImageUrl(fileDir + File.separator + fileName);
        image.setDestination(destination);
        destination.getDestinationGallery().add(image);

      }

      destinationsRepository.save(destination);

    } catch (Exception e) {
      // e.printStackTrace();
      throw new IllegalArgumentException("Error adding destination: " + e.getLocalizedMessage());
    }
  }

  public Map<String, Object> getAllDestinationByCategory(String urlValue) {

    try {

      DestinationCategory category = destinationCatgRepository.findByUrlValue(urlValue);
      return Map.of("destinations",
          destinationsRepository.findDestinationsWithFirstGallery(category.getId()).stream().map(dest -> {
            try {
              Map<String, String> map = new HashMap<>();
              map.put("gallery_image", crypto.encrypt(dest.get("gallery_image").toString()));
              map.put("destination_title", dest.get("destination_title").toString()); // include other fields as needed
              map.put("destination_description", dest.get("destination_description").toString());
              map.put("destination_url", dest.get("destination_url").toString());
              map.put("gallery_title", dest.get("gallery_title").toString());
              return map;
            } catch (Exception e) {
              return null;
            }
          }),
          "coverImage", crypto.encrypt(category.getCoverImage()).replaceAll("/", "-"));
    } catch (Exception e) {
      e.printStackTrace();
      throw new IllegalArgumentException("Error adding destination: " + e.getLocalizedMessage());
    }
  }

  public Map<String, Object> getdestinationDetails(String asText) throws Exception {

    try {

      Destinations destination = destinationsRepository.findByUrlValue(asText);

      if (destination == null) {
        throw new IllegalArgumentException("Destination not found.");
      }

      Map<String, Object> map = new HashMap<>();
      map.put("activities", activityRepository.findByDestinations(destination));
      map.put("travelTips", travelTipsRepository.findByDestination(destination));
      map.put("whyVisits", whyVisitRepository.findByDestination(destination));
      map.put("travel", travelRepository.findByDestination(destination));
      map.put("whichTime", whichTimeRepository.findByDestination(destination));
      map.put("attraction", attractionRepository.findByDestination(destination));
      map.put("accomodation", accomodationRepository.findByDestination(destination));
      // map.put("cuisine", cuisineRepository.findByDestination(destination));
      map.put("destination", destination);
      // adding images
      map.put("images",
          destinationGalleryRepository.findByDestinationAndFileType(destination,
              "IMAGE").stream().map(gallery -> {
                try {
                  return crypto.encrypt(gallery.getImageUrl());
                } catch (Exception e) {
                  return null;
                }
              }).filter(Objects::nonNull).collect(Collectors.toList()));

      // add reviews
      map.put("reviews", feedbackRepository.findAllByDestinationAndIsActiveTrue(destination).stream().map(feedback -> {
        try {
          Map<String, Object> temp = new HashMap<>();
          temp.put("image", crypto.encrypt(feedback.getImage()));
          temp.put("name", feedback.getName());
          // temp.put("destination", feedback.getDestination().getTitle());
          temp.put("rating", feedback.getRating());
          temp.put("content", feedback.getContent());
          return temp;
        } catch (Exception e) {
          throw new IllegalArgumentException("Error while fetching categories.");
        }
      }).toList());

      return map;

    } catch (Exception e) {
      e.printStackTrace();
      throw new IllegalArgumentException(e.getMessage());
    }

  }

  public Page<Destinations> getDestinations(int page, int size, Sort sort) {
    return destinationsRepository.findAll(PageRequest.of(page, size, sort));
  }

  public List<Map<String, Object>> getDestinationsGroupByCategory() {
    try {
      List<DestinationCategory> categories = destinationCatgRepository.findAll();
      List<Map<String, Object>> destinations = new ArrayList<>();
      for (DestinationCategory category : categories) {
        List<Object[]> dests = destinationsRepository.getByCategory(category);
        Map<String, Object> map = new HashMap<>();
        if (!dests.isEmpty()) {
          map.put("category", category.getName());
          map.put("destinations", dests);
          destinations.add(map);
        }
      }
      return destinations;
    } catch (Exception ex) {
      ex.printStackTrace();
      throw new IllegalArgumentException("Error while fetching data.");
    }
  }

  public Map<String, Object> getAlbumByDestination(String urlValue) {
    try {
      Destinations destination = destinationsRepository.findByUrlValue(urlValue);
      if (destination == null) {
        throw new IllegalArgumentException("Destination not found");
      }
      List<DestinationGallery> gallery = destinationGalleryRepository.findByDestination(destination);

      List<String> images = gallery.stream()
          .filter(row -> "IMAGE".equals(row.getFileType()))
          .map(row -> {
            try {
              return crypto.encrypt(row.getImageUrl()).replaceAll("/", "-");
            } catch (Exception e) {
              return null; // Or log the exception as needed
            }
          })
          .filter(Objects::nonNull) // Optional: removes nulls from failed encryptions
          .toList();

      List<Map<String, String>> brochures = gallery.stream()
          .filter(row -> "BROCHURE".equals(row.getFileType()))
          .map(row -> {
            try {
              Map<String, String> temp = new HashMap<>();
              temp.put("url", crypto.encrypt(row.getImageUrl()).replaceAll("/", "-"));
              temp.put("title", row.getTitle());
              return temp;
            } catch (Exception e) {
              return null; // Or log the exception as needed
            }
          })
          .filter(Objects::nonNull) // Optional: removes nulls from failed encryptions
          .toList();

      List<String> videos = gallery.stream()
          .filter(row -> "VIDEO".equals(row.getFileType()))
          .map(row -> {
            try {
              return crypto.encrypt(row.getImageUrl()).replaceAll("/", "-");
            } catch (Exception e) {
              return null; // Or log the exception as needed
            }
          })
          .filter(Objects::nonNull) // Optional: removes nulls from failed encryptions
          .toList();

      return Map.of("images", images, "videos", videos, "brochures", brochures);

    } catch (Exception e) {
      e.printStackTrace();
      throw new IllegalArgumentException("Error while fetching data.");
    }
  }

  public void uploadDestinationData(JsonNode request, MultipartFile[] images, MultipartFile[] videos,
      MultipartFile[] brochures) {

    try {
      String destinationUrlValue = request.has("destination") ? request.get("destination").asText() : "";

      Destinations destination = destinationsRepository.findByUrlValue(destinationUrlValue);
      if (destination == null) {
        throw new IllegalArgumentException("Destination not found");
      }

      String categoryUrlValue = destination.getCategory().getUrlValue();

      String fileDir = mediaPath
          + File.separator + utility.generateYearMonth()
          + File.separator + "category"
          + File.separator + categoryUrlValue
          + File.separator + destinationUrlValue;

      // looping through images
      if (images != null && images.length > 0) {
        for (int i = 0; i < images.length; i++) {
          MultipartFile image = images[i];
          String extension = utility.getFileExtensionWithDot(image.getOriginalFilename());
          String fileName = utility.generateUniqueNumber() + extension;

          boolean isSaved = fileService.uploadFile(fileDir + File.separator + "Images", fileName, image);

          DestinationGallery gallery = new DestinationGallery();
          gallery.setTitle(
              request.has("images[" + i + "][title]") ? request.get("images[" + i + "][title]").asText() : "");
          gallery.setDescription(
              request.has("images[" + i + "][description]")
                  ? request.get("images[" + i + "][description]").asText()
                  : "");
          gallery.setDestination(destination);
          gallery.setFileType("IMAGE");

          gallery.setImageUrl(fileDir + File.separator + "Images" + File.separator + fileName);

          destinationGalleryRepository.save(gallery);
        }
      }

      // looping through videos
      if (videos != null && videos.length > 0) {
        for (int i = 0; i < videos.length; i++) {
          MultipartFile video = videos[i];
          String extension = utility.getFileExtensionWithDot(video.getOriginalFilename());
          String fileName = utility.generateUniqueNumber() + extension;
          boolean isSaved = fileService.uploadFile(fileDir + File.separator + "Videos", fileName, video);

          DestinationGallery gallery = new DestinationGallery();
          gallery.setTitle(
              request.has("videos[" + i + "][title]") ? request.get("videos[" + i + "][title]").asText() : "");
          gallery.setDescription(
              request.has("videos[" + i + "][description]")
                  ? request.get("videos[" + i + "][description]").asText()
                  : "");
          gallery.setDestination(destination);
          gallery.setFileType("VIDEO");
          gallery.setImageUrl(fileDir + File.separator + "Videos" + File.separator + fileName);

          destinationGalleryRepository.save(gallery);
        }
      }

      // looping through brochures
      if (brochures != null && brochures.length > 0) {
        // for (MultipartFile brochure : brochures) {
        for (int i = 0; i < brochures.length; i++) {
          MultipartFile brochure = brochures[i];
          String extension = utility.getFileExtensionWithDot(brochure.getOriginalFilename());
          String fileName = utility.generateUniqueNumber() + extension;
          boolean isSaved = fileService.uploadFile(fileDir + File.separator + "Brochures", fileName, brochure);

          DestinationGallery gallery = new DestinationGallery();
          gallery.setTitle(
              request.has("brochures[" + i + "][title]") ? request.get("brochures[" + i + "][title]").asText() : "");
          gallery.setDescription(
              request.has("brochures[" + i + "][description]")
                  ? request.get("brochures[" + i + "][description]").asText()
                  : "");
          gallery.setDestination(destination);
          gallery.setFileType("BROCHURE");
          gallery.setImageUrl(fileDir + File.separator + "Brochures" + File.separator + fileName);
          destinationGalleryRepository.save(gallery);
        }
      }

    } catch (Exception e) {
      throw new IllegalArgumentException("Destination not found");
    }

  }

  public void uploadActivityData(JsonNode request, MultipartFile[] images, MultipartFile[] videos,
      MultipartFile[] brochures) {

    try {
      String activityUrlValue = request.has("activity") ? request.get("activity").asText() : "";

      Activity activity = activityRepository.findByUrlValue(activityUrlValue);
      if (activity == null) {
        throw new IllegalArgumentException("activity not found");
      }

      String fileDir = mediaPath
          + File.separator + utility.generateYearMonth()
          + File.separator + "activity"
          + File.separator + activityUrlValue;

      // looping through images
      if (images != null && images.length > 0) {
        for (int i = 0; i < images.length; i++) {
          MultipartFile image = images[i];
          String extension = utility.getFileExtensionWithDot(image.getOriginalFilename());
          String fileName = utility.generateUniqueNumber() + extension;

          boolean isSaved = fileService.uploadFile(fileDir + File.separator + "Images", fileName, image);

          ActivityGallery gallery = new ActivityGallery();
          gallery.setTitle(
              request.has("images[" + i + "][title]") ? request.get("images[" + i + "][title]").asText() : "");
          gallery.setActivity(activity);
          gallery.setFileType("IMAGE");

          gallery.setImageUrl(fileDir + File.separator + "Images" + File.separator + fileName);

          activityGalleryRepository.save(gallery);
        }
      }

      // looping through videos
      if (videos != null && videos.length > 0) {
        for (int i = 0; i < videos.length; i++) {
          MultipartFile video = videos[i];
          String extension = utility.getFileExtensionWithDot(video.getOriginalFilename());
          String fileName = utility.generateUniqueNumber() + extension;
          boolean isSaved = fileService.uploadFile(fileDir + File.separator + "Videos", fileName, video);

          ActivityGallery gallery = new ActivityGallery();
          gallery.setTitle(
              request.has("videos[" + i + "][title]") ? request.get("videos[" + i + "][title]").asText() : "");

          gallery.setActivity(activity);
          gallery.setFileType("VIDEO");
          gallery.setImageUrl(fileDir + File.separator + "Videos" + File.separator + fileName);

          activityGalleryRepository.save(gallery);
        }
      }

      // looping through brochures
      if (brochures != null && brochures.length > 0) {
        // for (MultipartFile brochure : brochures) {
        for (int i = 0; i < brochures.length; i++) {
          MultipartFile brochure = brochures[i];
          String extension = utility.getFileExtensionWithDot(brochure.getOriginalFilename());
          String fileName = utility.generateUniqueNumber() + extension;
          boolean isSaved = fileService.uploadFile(fileDir + File.separator + "Brochures", fileName, brochure);

          ActivityGallery gallery = new ActivityGallery();
          gallery.setTitle(
              request.has("brochures[" + i + "][title]") ? request.get("brochures[" + i + "][title]").asText() : "");
          gallery.setActivity(activity);
          gallery.setFileType("BROCHURE");
          gallery.setImageUrl(fileDir + File.separator + "Brochures" + File.separator + fileName);
          activityGalleryRepository.save(gallery);
        }
      }

    } catch (Exception e) {
      throw new IllegalArgumentException(e.getMessage());
    }

  }
}
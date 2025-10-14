package org.bisag.jktourism.services;

import java.io.File;
import java.util.List;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.models.Event;
import org.bisag.jktourism.payload.response.EventResponse;
import org.bisag.jktourism.repository.EventRepository;
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
public class EventService {

    @Value("${mediaPath}")
    String mediaPath;

    @Autowired
    Utility utility;

    @Autowired
    private ImageValidationService imageValidationService;

    @Autowired
    EventRepository eventRepository;

    @Autowired
    FileService fileService;

    @Autowired
    Crypto crypto;

    public void createEvent(Event event, MultipartFile file) {

        try {
            imageValidationService.validateImage(file);

            // extract image file extension
            String extension = utility.getFileExtensionWithDot(file.getOriginalFilename());

            String fileDir = mediaPath + File.separator + utility.generateYearMonth()
                    + File.separator + "events";

            String fileName = utility.generateUniqueNumber() + extension;

            boolean isSaved = fileService.uploadFile(fileDir, fileName, file);

            if (isSaved) {
                event.setImage(fileDir + File.separator + fileName);
                eventRepository.save(event);

            } else {
                throw new IllegalArgumentException("Error saving event");
            }

        } catch (Exception e) {
            throw new IllegalArgumentException("Error creating event: " + e.getLocalizedMessage());
        }
    }

    public Page<Event> getEvents(int page, int size, Sort sort) throws Exception {
        return eventRepository.findAll(PageRequest.of(page, size, sort)).map(row -> {
            try {
                row.setImage(crypto.encrypt(row.getImage()));
            } catch (Exception ex) {

            }
            return row;
        });
    }

    public List<EventResponse> fetchAll() throws Exception {
        return eventRepository.getEvents().stream().map(row -> {
            try {
                row.setImage(crypto.encrypt(row.getImage()).replaceAll("/", "-"));
            } catch (Exception ex) {
            }
            return row;
        }).toList();
    }

    public void updateEvent(Long id, boolean isApproved) {
        try {
            eventRepository.updateEventVisibilityById(id, isApproved);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error updating event status: " + e.getLocalizedMessage());
        }
    }

    public Event getEvent(Long id) throws Exception {
        try {
            Event event = eventRepository.findById(id).orElse(null);
            if (event == null) {
                throw new Exception("Event not found.");
            }
            event.setImage(crypto.encrypt(event.getImage()).replaceAll("/", "-"));
            return event;
        } catch (Exception e) {
            return null;
        }
    }
}

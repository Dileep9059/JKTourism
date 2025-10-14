package org.bisag.jktourism.controllers;

import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import org.bisag.jktourism.services.LandingPageService;
import org.bisag.jktourism.utils.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/landing")
public class LandingController {

    @Autowired
    LandingPageService landingPageService;

    @GetMapping("/slider-images")
    public ResponseEntity<String> getMethodName() throws Exception {
        List<Map<String, String>> sliderImages = landingPageService.getSliderImages();
        return new ResponseEntity<>(Json.serialize(sliderImages), HttpStatus.OK);
    }

}

package org.bisag.jktourism.controllers;

import org.bisag.jktourism.services.DestinationCategoryService;
import org.bisag.jktourism.utils.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    DestinationCategoryService categoryService;

    @PostMapping("/getAllCategories")
    public ResponseEntity<String> getAllCategories() throws Exception {
        return ResponseEntity.ok().body(Json.serialize(categoryService.getAllCategories()));
    }

}

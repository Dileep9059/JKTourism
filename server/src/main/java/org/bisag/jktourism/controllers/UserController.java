package org.bisag.jktourism.controllers;

import java.security.Principal;

import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.services.FeedbackService;
import org.bisag.jktourism.services.UserService;
import org.bisag.jktourism.utils.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

	@Autowired
	Crypto crypto;

	@Autowired
	JdbcTemplate template;

	@Autowired
	UserService userService;

	@Autowired
	FeedbackService feedbackService;

	@GetMapping("/get-feedbacks")
	public ResponseEntity<String> getMethodName(Principal prinicpal) throws Exception {
		try {
			return ResponseEntity.ok().body(Json.serialize(feedbackService.getMyFeedbacks(prinicpal.getName())));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
		}
	}

}

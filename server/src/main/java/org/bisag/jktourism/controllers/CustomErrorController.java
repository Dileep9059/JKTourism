package org.bisag.jktourism.controllers;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.bisag.jktourism.utils.Json;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class CustomErrorController implements ErrorController {

    private static final Logger logger = LoggerFactory.getLogger(CustomErrorController.class);

    @RequestMapping("/error")
    public ResponseEntity<String> handleError(HttpServletRequest request) throws Exception {
        Integer statusCode = (Integer) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        String requestUri = (String) request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("path", requestUri != null ? requestUri : request.getRequestURI());

        if (statusCode != null) {
            HttpStatus status = HttpStatus.valueOf(statusCode);
            body.put("status", statusCode);

            switch (statusCode) {
                case 404:
                    body.put("error", "Not Found");
                    body.put("message", "The requested endpoint does not exist");
                    logger.error("404 - Endpoint not found: {}", requestUri);
                    break;
                case 401:
                    // Only return auth error if it's actually an auth issue
                    // Check if this came from your security filter
                    String authError = (String) request.getAttribute("auth_error_message");
                    body.put("error", "Unauthorized");
                    body.put("message", authError != null ? authError : "Authentication required");
                    logger.error("401 - Unauthorized access: {}", requestUri);
                    break;
                case 403:
                    body.put("error", "Forbidden");
                    body.put("message", "Access denied");
                    logger.error("403 - Access forbidden: {}", requestUri);
                    break;
                case 500:
                    body.put("error", "Internal Server Error");
                    body.put("message", "An internal server error occurred");
                    logger.error("500 - Internal server error: {}", requestUri);
                    break;
                default:
                    body.put("error", status.getReasonPhrase());
                    body.put("message", "An error occurred");
                    logger.error("Error {} occurred: {}", statusCode, requestUri);
                    break;
            }

            return ResponseEntity.status(status).body(Json.serialize(body));
        }

        // Default response
        body.put("status", 500);
        body.put("error", "Internal Server Error");
        body.put("message", "An unknown error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Json.serialize(body));
    }
}
package org.bisag.jktourism.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.bisag.jktourism.annotations.LogApiHit;
import org.bisag.jktourism.repository.DestinationsRepository;
import org.bisag.jktourism.services.ApiHitLogger;
import org.bisag.jktourism.utils.Json;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;

@Aspect
@Component
public class ApiHitAspect {

    private final ApiHitLogger apiHitLogger;

    private final DestinationsRepository destinationRepository;

    public ApiHitAspect(ApiHitLogger apiHitLogger, DestinationsRepository destinationRepository) {
        this.apiHitLogger = apiHitLogger;
        this.destinationRepository = destinationRepository;
    }

    @After("@annotation(logApiHit)")
    public void logApiHit(JoinPoint joinPoint, LogApiHit logApiHit) {
        Object[] args = joinPoint.getArgs();

        String category = null;
        String subCategory = null;
        String userIdentifier = null;

        for (Object arg : args) {
            if (arg instanceof String requestBody) {
                try {
                    if (logApiHit.type().equals("experience")) {
                        subCategory = Json.deserialize(String.class, requestBody);
                    } else {

                        JsonNode json = Json.deserialize(JsonNode.class, requestBody);

                        category = json.has("categoryName") ? json.get("categoryName").asText() : null;
                        subCategory = switch (logApiHit.type()) {
                            case "activities" -> json.has("activityName") ? json.get("activityName").asText() : null;
                            case "shopping" -> json.has("name") ? json.get("name").asText() : null;
                            default -> json.has("placeName") ? json.get("placeName").asText() : null;
                        };

                        if (category == null && subCategory != null) {
                            category = destinationRepository.findByUrlValue(subCategory).getCategory().getName();
                        }
                    }

                } catch (Exception e) {
                    System.err.println("Failed to parse request body for logging: " + e.getMessage());
                }
            }
        }

        apiHitLogger.log(
                logApiHit.type(),
                category,
                subCategory,
                logApiHit.action(),
                userIdentifier);
    }
}

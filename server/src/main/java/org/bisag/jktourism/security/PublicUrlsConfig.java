package org.bisag.jktourism.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PublicUrlsConfig {
    @Bean
    public List<String> publicUrls() {
        return List.of(
                "/api/category/**",
                "/files/**",
                "/api/landing/**",
                "/api/amenities/**",
                "/api/ut/**",
                "/api/events/**",
                "/api/travel-agent/**",
                "/api/destination/**",
                "/api/activities/**",
                "/api/police-location/**",
                "/api/tour-guide/**",
                "/api/home-stay/**",
                "/api/experiences/**",
                "/api/shopping/**",
                "/api/feedback/submit-feedback",
                "/api/feedback/get-public-feedbacks",
                "/api/common/**",
                "/api/houseboat/**",
                "/api/chatbot/**");
    }
}

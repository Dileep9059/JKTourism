package org.bisag.jktourism.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bisag.jktourism.record.CategoryStat;
import org.bisag.jktourism.record.SubCategoryStat;
import org.bisag.jktourism.repository.ApiHitRepository;
import org.bisag.jktourism.services.UserLoginService;
import org.bisag.jktourism.utils.Json;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ApiHitRepository apiHitRepository;
    private final JdbcTemplate template;
    private final UserLoginService userLoginService;

    @PostMapping("/destination-chart")
    public ResponseEntity<?> destinationChart() throws Exception {
        try {
            List<CategoryStat> categories = apiHitRepository.getCategoryStats();
            List<SubCategoryStat> subCategories = apiHitRepository.getSubCategoryStats();

            Map<String, Object> response = new HashMap<>();
            response.put("categories", categories);
            response.put("subCategories", subCategories);

            return ResponseEntity.ok().body(Json.serialize(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @PostMapping("/experience-chart")
    public ResponseEntity<?> experienceChart() throws Exception {
        try {
            return ResponseEntity.ok().body(Json.serialize(apiHitRepository.getExperienceStats()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @PostMapping("/activity-chart")
    public ResponseEntity<?> activityChart() throws Exception {
        try {
            return ResponseEntity.ok().body(Json.serialize(apiHitRepository.getActivityStats()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @PostMapping("/shopping-chart")
    public ResponseEntity<?> shoppingChart() throws Exception {
        try {
            return ResponseEntity.ok().body(Json.serialize(apiHitRepository.getShoppingStats()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @GetMapping("/get-card-count")
    public ResponseEntity<?> getCardCount() throws Exception {
        try {
            Map<String, Object> count = new HashMap<>();

            count.put("iosCount", 0);
            count.put("loginCount", userLoginService.getTodayLoginCount());
            count.put("androidCount", 0);
            count.put("activeAccounts", template.queryForObject("select count(*) from public.users", Long.class));
            return ResponseEntity.ok().body(Json.serialize(count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

    @GetMapping("/get-total-visitors")
    public ResponseEntity<?> getTotalVisitors() throws Exception {
        try {
            String q = """
                    select
                        to_char(created_on, 'YYYY-MM-DD') as date,
                        count(*) filter (where client_type = 'web') as desktop,
                        count(*) filter (where client_type = 'mobile') as mobile
                    from visitors
                    where created_on >= current_date - interval '3 months'
                    group by to_char(created_on, 'YYYY-MM-DD')
                    order by date;

                                """;
            List<Map<String, Object>> result = template.queryForList(q);
            return ResponseEntity.ok().body(Json.serialize(result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
        }
    }

}

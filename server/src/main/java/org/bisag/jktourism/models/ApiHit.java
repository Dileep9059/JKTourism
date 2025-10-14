package org.bisag.jktourism.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "api_hits")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApiHit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g., category, experience, shopping, cuisines, activities
    // @Column(nullable = false)
    private String type;  

    // e.g., "Gardens", "Lakes" (null for non-category types like experiences)
    private String category;  

    // e.g., "NishatGarden", "Dal", "LavenderBloom"
    // @Column(nullable = false)
    private String subCategory;  

    private String action;      // list / detail / list-destinations

    @Column(nullable = false)
    private LocalDateTime hitTime;

    // Optionally capture IP, userId, or session info
    private String userIdentifier;
}

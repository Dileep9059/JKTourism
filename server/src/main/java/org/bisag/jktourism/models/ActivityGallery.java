package org.bisag.jktourism.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ActivityGallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @NotBlank
    @Column(columnDefinition = "varchar")
    private String imageUrl;

    private String fileType; // IMAGE / VIDEO / BROCHURE

    // @NotBlank(message = "Description should not be empty.")
    // @Column(columnDefinition = "varchar")
    // private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    @JsonIgnore
    private Activity activity;

    @PrePersist
    private void setDefaults() {
        // if fileType is not set, set it to IMAGE
        if (this.fileType == null){
            this.fileType = "IMAGE";
        }
    }
}

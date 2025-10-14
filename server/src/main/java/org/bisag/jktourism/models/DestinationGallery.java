package org.bisag.jktourism.models;

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
public class DestinationGallery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Image title should not be empty.")
    private String title;

    @NotBlank
    @Column(columnDefinition = "varchar")
    private String imageUrl;

    @NotBlank(message = "Descripion should not be empty.")
    @Column(columnDefinition = "varchar")
    private String description;

    private String fileType; // IMAGE / VIDEO / BROCHURE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destinations destination;

    @PrePersist
    private void setIsApprovedAndUri() {
        // if fileType is not set, set it to IMAGE
        if (this.fileType == null){
            this.fileType = "IMAGE";
        }
    }
}

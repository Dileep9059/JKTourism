package org.bisag.jktourism.models;

import java.util.Arrays;
import java.util.Date;
import java.util.stream.Collectors;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DestinationCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50, message = "Name should not be more than 50 characters.")
    private String name;

    @CreationTimestamp
    @Column(updatable = false)
    private Date createdOn;

    @CreationTimestamp
    @Column(updatable = true)
    private Date updatedOn;

    private Boolean isApproved;

    @NotBlank(message = "Cover Image should not be empty")
    @Column(columnDefinition = "varchar")
    private String coverImage;

    @NotBlank
    private String coverImageName;

    @NotBlank(message = "URL value should not be empty")
    @Column(columnDefinition = "varchar")
    private String urlValue;

    @PrePersist
    private void setIsApprovedAndUri() {
        this.isApproved = false;

        if (name != null) {
            this.urlValue = Arrays.stream(
                    name.trim()
                        .split("[^a-zA-Z0-9]+") // Split on any non-alphanumeric character
                )
                .filter(word -> !word.isEmpty()) // Ignore empty parts
                .map(word -> Character.toUpperCase(word.charAt(0)) + word.substring(1).toLowerCase())
                .collect(Collectors.joining());
        }
    }

}

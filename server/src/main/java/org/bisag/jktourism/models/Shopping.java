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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Shopping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "varchar")
    private String description;

    @Column(columnDefinition = "varchar")
    private String content;

    @NotBlank(message = "URL value should not be empty")
    @Column(columnDefinition = "varchar")
    private String urlValue;

    private Boolean isApproved;

    @CreationTimestamp
    @Column(updatable = false)
    private Date createdOn;

    @CreationTimestamp
    @Column(updatable = true)
    private Date updatedOn;

    @PrePersist
    private void setDefaultValues() {
        this.isApproved = false;

        if (title != null) {
            this.urlValue = Arrays.stream(
                    title.trim()
                            .split("[^a-zA-Z0-9]+") // Split on any non-alphanumeric character
            )
                    .filter(word -> !word.isEmpty()) // Ignore empty parts
                    .map(word -> Character.toUpperCase(word.charAt(0)) + word.substring(1).toLowerCase())
                    .collect(Collectors.joining());
        }
    }
}

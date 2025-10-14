package org.bisag.jktourism.models;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
public class Destinations {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "Title should not be empty.")
  private String title;

  @NotBlank(message = "Description should not be empty.")
  @Column(columnDefinition = "varchar")
  private String description;

  @Column(columnDefinition = "varchar")
  private String content;

  @Column(columnDefinition = "varchar")
  private String others;

  private Boolean isDrafted;
  private Boolean isApproved;

  // @NotBlank(message = "Category should not be empty.")
  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id", nullable = false)
  private DestinationCategory category;

  @CreationTimestamp
  @Column(updatable = false)
  private Date createdOn;

  @CreationTimestamp
  @Column(updatable = true)
  private Date updatedOn;

  @JsonIgnore
  @ManyToMany
  @JoinTable(name = "destination_activity", joinColumns = @JoinColumn(name = "destination_id"), inverseJoinColumns = @JoinColumn(name = "activity_id"))
  private Set<Activity> activities = new HashSet<>();

  @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<WhyVisit> whyVisits = new ArrayList<>();

  @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<Attraction> attractions = new ArrayList<>();

  @ManyToMany
  @JsonIgnore
  @JoinTable(name = "destination_cuisine", joinColumns = @JoinColumn(name = "destination_id"), inverseJoinColumns = @JoinColumn(name = "cuisine_id"))
  private List<Cuisine> cuisines = new ArrayList<>();

  @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<TravelTips> travelTips = new ArrayList<>();

  @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<Travel> travel = new ArrayList<>();

  @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<Accomodation> accomodation = new ArrayList<>();

  @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<WhichTime> whichTime = new ArrayList<>();

  @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<DestinationGallery> destinationGallery = new ArrayList<>();

  @NotBlank(message = "URL value should not be empty")
  @Column(columnDefinition = "varchar")
  private String urlValue;

  @PrePersist
  private void setIsDraftedAndIsApprovedAdnUri() {
    this.isDrafted = true;
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

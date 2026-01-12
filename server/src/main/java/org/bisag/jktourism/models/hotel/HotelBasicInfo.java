package org.bisag.jktourism.models.hotel;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "hotel_basic_info")
@Getter
@Setter
public class HotelBasicInfo {

    @Id
    private UUID hotelId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @Column(columnDefinition = "text")
    private String description;

    private String hotelType;
    private Integer starRating;
    private Integer establishedYear;

    private String websiteUrl;
    private String publicEmail;
    private String publicPhone;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}

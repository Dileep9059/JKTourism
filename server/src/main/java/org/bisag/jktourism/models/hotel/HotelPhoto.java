package org.bisag.jktourism.models.hotel;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Getter;
import lombok.Setter;

@Table(name = "hotel_photos")
@Getter
@Setter
@Entity
public class HotelPhoto {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Column(nullable = false)
    private String photoUrl;

    // @Column(nullable = false) 
    // FACADE, LOBBY, RESTAURANT, PARKING, POOL, OTHER

    private Integer sortOrder;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}

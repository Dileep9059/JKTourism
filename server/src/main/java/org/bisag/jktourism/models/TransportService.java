package org.bisag.jktourism.models;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TransportService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private String district;
    private String state;

    private String email;
    private String contact;

    @Column(columnDefinition = "varchar")
    private String registrationDetail;

    @OneToMany(mappedBy = "transportService", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<TransportServiceVehicle> vehicles = new ArrayList<>();

    @Column(nullable = false, unique = true, updatable = false)
    private String uuid;

    @PrePersist
    public void generateUuid() {
        this.uuid = UUID.randomUUID().toString();
    }
}

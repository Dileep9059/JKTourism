package org.bisag.jktourism.models;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class PoliceLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;

    private double latitude;
    private double longitude;

    private String district;
    private String state;

    @Column(columnDefinition = "geometry")
    @JsonIgnore
    private Geometry geom;

    @CreationTimestamp
    private Date createdOn;

    @CreationTimestamp
    @Column(updatable = true)
    private Date updatedOn;

    @PrePersist
    private void setDefaultValues() {
        // create geometry from latitude and longitude
        this.geom = createPoint(longitude, latitude, 4326);
    }

    private Point createPoint(double longitude, double latitude, int srid) {
        GeometryFactory geometryFactory = new GeometryFactory();
        Coordinate coordinate = new Coordinate(longitude, latitude);
        Point point = geometryFactory.createPoint(coordinate);
        point.setSRID(srid);
        return point;
    }

}

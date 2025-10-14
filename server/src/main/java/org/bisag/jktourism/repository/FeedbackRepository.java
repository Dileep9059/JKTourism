package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.Destinations;
import org.bisag.jktourism.models.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findAllByIsActiveTrue();

    List<Feedback> findAllByDestinationAndIsActiveTrue(Destinations destination);

    List<Feedback> findAllByEmailAndIsActiveTrue(String email);

}

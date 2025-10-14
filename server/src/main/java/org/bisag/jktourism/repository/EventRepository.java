package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.Event;
import org.bisag.jktourism.payload.response.EventResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT new org.bisag.jktourism.payload.response.EventResponse(e.id, e.title, e.image, e.startDate) FROM Event e WHERE e.isApproved = true")
    List<EventResponse> getEvents();

    @Modifying
    @Transactional
    @Query(value = "UPDATE event SET is_approved = :isApproved WHERE id = :id", nativeQuery = true)
    void updateEventVisibilityById(@Param("id") Long id, @Param("isApproved") Boolean isApproved);

}

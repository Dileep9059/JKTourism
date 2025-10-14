package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    Experience findByUrlValue(String urlValue);

    List<Experience> findAllByIsApprovedTrue();

    @Modifying
    @Transactional
    @Query(value = "UPDATE experience SET is_approved = NOT is_approved, updated_on = CURRENT_TIMESTAMP WHERE id = :id", nativeQuery = true)
    void toggleExperienceVisibilityById(@Param("id") Long id);

}

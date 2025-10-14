package org.bisag.jktourism.repository;

import java.util.List;

import org.bisag.jktourism.models.PasswordHistory;
import org.bisag.jktourism.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PasswordHistoryRepository extends JpaRepository<PasswordHistory, Long> {

    List<PasswordHistory> findTop3ByUserOrderByChangedAtDesc(User user);

    @Modifying
    @Query("DELETE FROM PasswordHistory ph WHERE ph.user = :user")
    void deleteByUser(@Param("user") User user);
}
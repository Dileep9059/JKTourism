package org.bisag.jktourism.repository;

import java.time.LocalDateTime;

import org.bisag.jktourism.models.UserLoginLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserLoginLogRepository extends JpaRepository<UserLoginLog, Long> {

    @Query("""
                SELECT COUNT(u)
                FROM UserLoginLog u
                WHERE u.loginTime >= :startOfDay AND u.loginTime < :endOfDay
            """)
    long countLoginsToday(@Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);

}

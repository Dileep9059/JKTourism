package org.bisag.jktourism.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.bisag.jktourism.models.UserLoginLog;
import org.bisag.jktourism.repository.UserLoginLogRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserLoginService {

    private final UserLoginLogRepository userLoginLogRepository;

    public void recordLogin(String username) {
        UserLoginLog log = new UserLoginLog();
        log.setUsername(username);
        log.setLoginTime(LocalDateTime.now());
        userLoginLogRepository.save(log);
    }

    public long getTodayLoginCount() {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata")); // or UTC, depending on your app
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();
        return userLoginLogRepository.countLoginsToday(startOfDay, endOfDay);
    }
}
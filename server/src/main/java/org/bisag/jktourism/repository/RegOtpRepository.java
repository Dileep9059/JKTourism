package org.bisag.jktourism.repository;

import org.bisag.jktourism.models.RegOTP;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegOtpRepository extends JpaRepository<RegOTP, Long> {
    Optional<RegOTP> findByContact(String contact);
}
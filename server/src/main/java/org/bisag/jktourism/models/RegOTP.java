package org.bisag.jktourism.models;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegOTP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Min(0)
    private int attempt;

    @NotBlank(message = "Mode should not be empty.")
    private String mode; // "email" or "phone"

    @NotBlank(message = "Contact should not be empty.")
    @Column(unique = true)
    private String contact;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdOn;

    private Boolean expired;

    @Min(1000)
    @Max(9999)
    private Integer otp;

    private LocalDateTime otpGeneratedOn;

    private LocalDateTime lastAttemptTime;

    private Boolean blocked;

    private LocalDateTime blockedUntil;

    @Transient
    private static final long OTP_EXPIRATION_SECONDS = 5 * 60;

    @Transient
    private static final int MAX_ATTEMPTS = 3;

    @Transient
    private static final int BLOCK_DURATION_SECONDS = 15 * 60;

    @PrePersist
    public void prePersist() {
        attempt = 1;
        blocked = false;
        expired = false;
        if (createdOn == null) {
            createdOn = LocalDateTime.now();
        }
        if (otpGeneratedOn == null) {
            otpGeneratedOn = LocalDateTime.now();
        }
    }

    /**
     * Checks if the user is currently blocked.
     */
    public boolean isCurrentlyBlocked() {
        return Boolean.TRUE.equals(blocked)
                && blockedUntil != null;
    }

    /**
     * Checks whether the OTP has expired.
     */
    public boolean isOtpExpired() {
        return otpGeneratedOn != null
                && LocalDateTime.now().isAfter(otpGeneratedOn.plusSeconds(OTP_EXPIRATION_SECONDS));
    }

    /**
     * Checks whether the maximum allowed OTP attempts have been reached.
     */
    public boolean isMaxAttemptsReached() {
        return attempt >= MAX_ATTEMPTS;
    }

    /**
     * Handles a failed OTP attempt. If the maximum is reached, the user is blocked.
     */
    public void registerFailedAttempt() {
        LocalDateTime now = LocalDateTime.now();

        if (isCurrentlyBlocked()) {
            if (blockedUntil.isBefore(now)) {
                // Unblock the user
                blocked = false;
                blockedUntil = null;
                attempt = 1;
            } else {
                throw new RuntimeException("Too many attempts. Try again after 15 minutes.");
            }
        }

        attempt++;
        lastAttemptTime = now;

        if (attempt >= MAX_ATTEMPTS) {
            blocked = true;
            blockedUntil = now.plusSeconds(BLOCK_DURATION_SECONDS);
        }
    }

    /**
     * Resets OTP and attempt-related data.
     */
    public void resetAttempts() {
        attempt = 1;
        blocked = false;
        blockedUntil = null;
        lastAttemptTime = null;
        otp = null;
        otpGeneratedOn = null;
        expired = true;
    }

    /**
     * Increases the number of attempts.
     */
    public void incrementAttempts() {
        this.attempt++;
    }
}

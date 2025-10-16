package org.bisag.jktourism.services;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.bisag.jktourism.models.RefreshToken;
import org.bisag.jktourism.models.User;
import org.bisag.jktourism.repository.RefreshTokenRepository;
import org.bisag.jktourism.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenService {

    @Value("${jkt.app.jwtRefreshExpirationMs}") // e.g., 7 days in ms
    private Long refreshTokenDurationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        // Delete existing token (if any)
        refreshTokenRepository.findByUser(user).ifPresent(existing -> {
            refreshTokenRepository.delete(existing);
        });

        // Create new token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(new Date(System.currentTimeMillis() + refreshTokenDurationMs));

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().before(new Date())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please sign in again.");
        }
        return token;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public int deleteByUserId(Long userId) {
        return refreshTokenRepository.deleteByUser(userRepository.findById(userId).orElseThrow());
    }

    public void delete(RefreshToken token) {
        refreshTokenRepository.deleteByToken(token.getToken());
    }
}

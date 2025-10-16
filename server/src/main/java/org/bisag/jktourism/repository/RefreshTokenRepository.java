package org.bisag.jktourism.repository;

import java.util.Optional;

import org.bisag.jktourism.models.RefreshToken;
import org.bisag.jktourism.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser(User user);

    int deleteByUser(User user);

    void deleteByToken(String token);
}

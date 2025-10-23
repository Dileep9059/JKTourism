package org.bisag.jktourism.security.jwt;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.bisag.jktourism.models.User;
import org.bisag.jktourism.repository.UserRepository;
import org.bisag.jktourism.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Autowired
  UserRepository userRepository;

  @Value("${jkt.app.jwtSecret}")
  private String jwtSecret;

  @Value("${jkt.app.jwtExpirationMs}")
  private int jwtExpirationMs;

  @Value("${jkt.app.jwtCookieName}")
  private String jwtCookie;

  public String getJwtFromCookies(HttpServletRequest request) {
    Cookie cookie = WebUtils.getCookie(request, jwtCookie);
    if (cookie != null) {
      return cookie.getValue();
    } else {
      return null;
    }
  }

  public String extractJwtToken(HttpServletRequest request) {
    if (request.getHeader("Authorization") != null) {
      return request.getHeader("Authorization").substring("Bearer ".length());
    }
    return "";
  }

  public ResponseCookie generateJwtCookie(UserDetailsImpl userPrincipal) {
    String jwt = generateTokenFromUsername(userPrincipal.getUsername(), userPrincipal.getAuthorities());
    ResponseCookie cookie = ResponseCookie.from(jwtCookie, jwt).path("/").maxAge(24 * 60 * 60).httpOnly(true)
        .secure(true).sameSite("strict").build();
    return cookie;
  }

  public ResponseCookie getCleanJwtCookie() {
    ResponseCookie cookie = ResponseCookie.from(jwtCookie, null).path("/").secure(true).httpOnly(true).sameSite("strict").build();
    return cookie;
  }

  public String getUserNameFromJwtToken(String token) {
    return Jwts.parser().verifyWith((SecretKey) key()).build()
        .parseSignedClaims(token).getPayload().getSubject();
  }

  private SecretKey key() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
  }

  public boolean validateJwtToken(String authToken) {
    try {
      Jwts.parser().verifyWith((SecretKey) key()).build().parseSignedClaims(authToken);

      Claims claims = Jwts.parser().verifyWith((SecretKey) key()).build().parseSignedClaims(authToken).getPayload();

      String userUUID = claims.getSubject();
      Date issuedAt = claims.getIssuedAt();

      if (userUUID == null || issuedAt == null) {
        return false; // invalid structure
      }

      User user = userRepository.findByUuid(userUUID).orElse(null);
      if (user == null) {
        return false;
      }

      LocalDateTime pwdChangedAt = user.getPasswordChangedAt();

      if (pwdChangedAt != null) {
        Instant tokenIssuedAt = issuedAt.toInstant();
        Instant passwordChangedAt = pwdChangedAt.atZone(ZoneId.systemDefault()).toInstant();

        if (tokenIssuedAt.isBefore(passwordChangedAt)) {
          // Token is outdated
          return false;
        }
      }

      return true;
    } catch (MalformedJwtException e) {
      logger.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      // logger.error("JWT claims string is empty: {}", e.getMessage());
    }

    return false;
  }

  public String generateTokenFromUsername(String username, Collection<? extends GrantedAuthority> roles) {
    User user = userRepository.findByUsername(username).orElseThrow();
    List<String> roleNames = roles.stream()
        .map(grantedAuthority -> grantedAuthority.getAuthority())
        .collect(Collectors.toList());

    return Jwts.builder()
        .subject(user.getUuid())
        .claim("roles", roleNames)
        .issuedAt(new Date())
        .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
        .signWith(key())
        .compact();
  }

}

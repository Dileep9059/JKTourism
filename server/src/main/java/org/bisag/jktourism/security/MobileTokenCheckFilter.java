package org.bisag.jktourism.security;

import java.io.IOException;
import java.util.List;

import org.bisag.jktourism.models.Visitors;
import org.bisag.jktourism.repository.VisitorRepository;
import org.bisag.jktourism.security.jwt.JwtUtils;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class MobileTokenCheckFilter extends OncePerRequestFilter {

    private static final String HEADER_CLIENT_TYPE = "X-Client-Type";
    private static final String HEADER_AUTHORIZATION = "Authorization";
    private static final String TOKEN_PREFIX = "Bearer ";

    private final List<String> PUBLIC_ENDPOINTS;

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;
    private final VisitorRepository visitorRepository;

    public MobileTokenCheckFilter(JwtUtils jwtUtils, UserDetailsService userDetailsService, List<String> publicUrls, VisitorRepository visitorRepository) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
        this.PUBLIC_ENDPOINTS = publicUrls;
        this.visitorRepository = visitorRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String clientType = request.getHeader(HEADER_CLIENT_TYPE);
        String path = request.getRequestURI();

        Visitors visitor = new Visitors();
        visitor.setIpAddress(request.getRemoteAddr());
        visitor.setClientType(clientType != null ? clientType : "web");
        visitorRepository.save(visitor);

        // if (isPublicEndpoint(path) && isMobileClient(clientType)) {
        //     String authHeader = request.getHeader(HEADER_AUTHORIZATION);

        //     if (!hasBearerToken(authHeader)) {
        //         writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED,
        //                 "Missing or invalid Authorization header for mobile request");
        //         return;
        //     }
        //     String jwt = authHeader.substring(TOKEN_PREFIX.length());

        //     try {
        //         if (!jwtUtils.validateJwtToken(jwt)) {
        //             writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
        //             return;
        //         }

        //         String userUUID = jwtUtils.getUserNameFromJwtToken(jwt);
        //         UserDetails userDetails = userDetailsService.loadUserByUsername(userUUID);

        //         UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
        //                 userDetails, null, userDetails.getAuthorities());

        //         authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        //         SecurityContextHolder.getContext().setAuthentication(authentication);

        //     } catch (Exception e) {
        //         e.printStackTrace();
        //         writeErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token validation failed");
        //         return;
        //     }
        // }

        filterChain.doFilter(request, response);
    }

    private static final AntPathMatcher pathMatcher = new AntPathMatcher();

    private boolean isPublicEndpoint(String path) {
        String normalizedPath = path.replaceFirst("^/jktourism-api", "");
        return PUBLIC_ENDPOINTS.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, normalizedPath));
    }

    private boolean isMobileClient(String clientType) {
        return "mobile".equalsIgnoreCase(clientType);
    }

    private boolean hasBearerToken(String authHeader) {
        return authHeader != null && authHeader.startsWith(TOKEN_PREFIX);
    }

    private void writeErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        if (!response.isCommitted()) {
            response.setStatus(status);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"" + message + "\"}");
            response.flushBuffer(); // 🔑 force commit response
        }
    }

}

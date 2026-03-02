package org.bisag.jktourism.security;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.bisag.jktourism.repository.RegOtpRepository;
import org.bisag.jktourism.security.jwt.AuthEntryPointJwt;
import org.bisag.jktourism.security.jwt.AuthTokenFilter;
import org.bisag.jktourism.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

	@Value("${spring.profiles.active}")
	String activeProfile;

	@Value("${frontEndUrl}")
	String frontEndUrl;

	@Autowired
	UserDetailsServiceImpl userDetailsService;

	@Autowired
	private AuthEntryPointJwt unauthorizedHandler;

	@Autowired
	private RegOtpRepository regOtpRepository;

	private final MobileTokenCheckFilter mobileTokenCheckFilter;
	private final List<String> publicUrls;

	public WebSecurityConfig(MobileTokenCheckFilter mobileTokenCheckFilter, List<String> publicUrls) {
		this.mobileTokenCheckFilter = mobileTokenCheckFilter;
		this.publicUrls = publicUrls;
	}

	@Bean
	AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

	@Bean
	DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

		authProvider.setUserDetailsService(userDetailsService);
		authProvider.setPasswordEncoder(passwordEncoder());

		return authProvider;
	}

	@Bean
	public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
		AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
		authBuilder.authenticationProvider(authenticationProvider());
		authBuilder.authenticationProvider(otpAuthenticationProvider());
		return authBuilder.build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	UrlBasedCorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration corsConfig = new CorsConfiguration();

		List<String> allowedOrigins = Arrays.stream(frontEndUrl.split(","))
				.map(String::trim)
				.collect(Collectors.toList());

		corsConfig.setAllowedOrigins(allowedOrigins);
		corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "OPTIONS"));

		corsConfig.setAllowedHeaders(Arrays.asList("*"));
		corsConfig.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", corsConfig);
		return source;
	}

	@Bean
	OtpAuthenticationProvider otpAuthenticationProvider() {
		return new OtpAuthenticationProvider(userDetailsService, regOtpRepository);
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authenticationManager,
			List<String> publicUrls) throws Exception {

		http.csrf(csrf -> csrf.disable())
				.authenticationManager(authenticationManager)
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/user/**").hasRole("USER")
						.requestMatchers("/api/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/profile/**").hasAnyRole("ADMIN", "USER")
						.requestMatchers("/api/auth/**", "/gis/**", "/api/files/**", "/error").permitAll()
						.requestMatchers(publicUrls.toArray(String[]::new)).permitAll()
						.anyRequest().authenticated());
		http.addFilterBefore(mobileTokenCheckFilter, UsernamePasswordAuthenticationFilter.class);
		http
				.authenticationProvider(authenticationProvider())
				.authenticationProvider(otpAuthenticationProvider());

		http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}

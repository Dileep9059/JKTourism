package org.bisag.jktourism.controllers;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.bisag.jktourism.models.ERole;
import org.bisag.jktourism.models.RegOTP;
import org.bisag.jktourism.models.Role;
import org.bisag.jktourism.models.User;
import org.bisag.jktourism.models.Visitors;
import org.bisag.jktourism.payload.request.ProfileUpdateRequest;
import org.bisag.jktourism.payload.response.MessageResponse;
import org.bisag.jktourism.payload.response.UserInfoResponse;
import org.bisag.jktourism.repository.RegOtpRepository;
import org.bisag.jktourism.repository.RoleRepository;
import org.bisag.jktourism.repository.UserRepository;
import org.bisag.jktourism.repository.VisitorRepository;
import org.bisag.jktourism.security.OtpAuthenticationToken;
import org.bisag.jktourism.security.jwt.JwtUtils;
import org.bisag.jktourism.security.services.UserDetailsImpl;
import org.bisag.jktourism.services.UserLoginService;
import org.bisag.jktourism.services.UserService;
import org.bisag.jktourism.utils.Json;
import org.bisag.jktourism.utils.NullPropertyUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
	RoleRepository roleRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

	@Autowired
	VisitorRepository visitorRepository;

	@Autowired
	JdbcTemplate template;

	@Autowired
	UserService userService;

	@Autowired
	RegOtpRepository regOtpRepository;

	private final UserLoginService userLoginService;

	AuthController(UserLoginService userLoginService) {
		this.userLoginService = userLoginService;
	}

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody String encryptedRequest) throws Exception {

		JsonNode loginRequest = Json.deserialize(JsonNode.class, encryptedRequest);

		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.get("username").asText(),
						loginRequest.get("password").asText()));

		SecurityContextHolder.getContext().setAuthentication(authentication);

		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

		String jwtToken = jwtUtils.generateTokenFromUsername(userDetails.getUsername(), userDetails.getAuthorities());

		List<String> roles = userDetails.getAuthorities().stream()
				.map(item -> item.getAuthority())
				.collect(Collectors.toList());

		User user = userRepository.findById(userDetails.getId()).orElseThrow();

		String name = user.getName();
		String firstName = user.getFirstname();
		String middleName = user.getMiddlename();
		String lastName = user.getLastname();
		String mobile = user.getMobile();

		userLoginService.recordLogin(userDetails.getUsername());

		return ResponseEntity.ok()
				.body(Json.serialize(new UserInfoResponse(userDetails.getId(), jwtToken,
						userDetails.getUsername(),
						userDetails.getEmail(),
						name,
						firstName,
						middleName,
						lastName,
						mobile,
						roles)));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody String encryptedRequest) throws Exception {

		JsonNode signUpRequest = Json.deserialize(JsonNode.class, encryptedRequest);

		if (userRepository.existsByEmail(signUpRequest.get("email").asText())) {
			return ResponseEntity.badRequest().body(Json.serialize("An account with this email already exists."));
		}

		if (userRepository.existsByMobile(signUpRequest.get("mobile").asText())) {
			return ResponseEntity.badRequest().body(Json.serialize("An account with this mobile already exists."));
		}

		if (!isValidPassword(signUpRequest.get("password").asText())) {
			return ResponseEntity.badRequest().body(Json.serialize(
					"Password must be at least 8 characters and include a number, an uppercase letter, and a symbol."));
		}

		if (signUpRequest.get("firstname").asText().trim().isEmpty()) {
			return ResponseEntity.badRequest().body(Json.serialize(
					"Please enter your first name."));
		}
		if (signUpRequest.get("lastname").asText().trim().isEmpty()) {
			return ResponseEntity.badRequest().body(Json.serialize(
					"Please enter your last name."));
		}

		// Create new user's account
		User user = new User();
		user.setUsername(signUpRequest.get("username").asText());
		user.setEmail(signUpRequest.get("email").asText());
		user.setPassword(encoder.encode(signUpRequest.get("password").asText()));

		// Newly added fields - 02/05/2025
		user.setFirstname(signUpRequest.get("firstname").asText());
		user.setMiddlename(
				signUpRequest.get("middlename").asText() == null ? "" : signUpRequest.get("middlename").asText());
		user.setLastname(signUpRequest.get("lastname").asText());
		user.setMobile(signUpRequest.get("mobile").asText());

		Set<String> strRoles = null;
		Set<Role> roles = new HashSet<>();

		if (strRoles == null) {
			Role userRole = roleRepository.findByName(ERole.ROLE_USER)
					.orElse(null);

			if (userRole == null) {
				userRole = new Role();
				userRole.setName(ERole.ROLE_USER);
				roleRepository.save(userRole);
			}
			roles.add(userRole);
		}

		user.setRoles(roles);
		userRepository.save(user);

		return ResponseEntity.ok(Json.serialize("Registration successful. Please log in to continue."));
	}

	private boolean isValidPassword(String password) {
		String regex = "^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$";
		return password.matches(regex);
	}

	@PostMapping("/signout")
	public ResponseEntity<?> logoutUser() throws Exception {
		ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
		return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
				.body(new MessageResponse("You've been signed out!"));
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<String> forgoPassword(@RequestBody String request) throws Exception {
		try {
			JsonNode json = Json.deserialize(JsonNode.class, request);

			userService.forgotPassword(json);

			return ResponseEntity.ok(Json.serialize("Password reset successfull."));

		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
		}
	}

	@PostMapping("/update-profile")
	public MessageResponse updateProfile(@RequestBody String req) throws Exception {
		try {
			// Get currently authenticated user's username from the security context
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			String currentUsername = auth.getName();

			// Decrypt and deserialize the request
			ProfileUpdateRequest data = Json.deserialize(ProfileUpdateRequest.class,
					req.trim().replaceAll("\\s+", " "));

			// Look up the user by authenticated username (ignore username from frontend)
			Optional<User> optionalUser = userRepository.findByUsername(currentUsername);
			if (optionalUser.isEmpty()) {
				return new MessageResponse("Authenticated user not found.");
			}

			User user = optionalUser.get();
			// Copy only non-null properties from DTO to entity
			BeanUtils.copyProperties(data, user, NullPropertyUtils.getNullPropertyNames(data));

			user.setUpdatedon(new Date());
			userRepository.save(user);

			return new MessageResponse("Profile updated successfully.");
		} catch (Exception e) {
			return new MessageResponse("Error updating profile: " + e.getMessage());
		}
	}

	@PostMapping("/send-otp")
	public ResponseEntity<String> sendOTP(@RequestBody String req) throws Exception {
		try {
			// Decrypt and deserialize the request
			JsonNode json = Json.deserialize(JsonNode.class, req);
			userService.sendOtp(json);
			return ResponseEntity.ok(Json.serialize("OTP sent successfully."));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Json.serialize(e.getMessage()));
		}
	}

	@PostMapping("/login-with-otp")
	public ResponseEntity<?> loginWithOtp(@RequestBody String request) throws Exception {
		try {
			JsonNode json = Json.deserialize(JsonNode.class, request);

			String username = json.get("username").asText();
			String otp = json.get("otp").asText();

			User user = userRepository.findByUsername(username).orElse(null);
			if (user == null) {
				throw new Exception("User not found");
			}

			RegOTP regOtp = regOtpRepository.findByContact(username).orElse(null);

			if (regOtp == null) {
				throw new Exception("OTP not found");
			}

			// validate otp
			if (!otp.equals(String.valueOf(regOtp.getOtp()))) {
				// invalid otp then register the failed attempt
				regOtp.registerFailedAttempt();
				regOtpRepository.save(regOtp);
				throw new Exception("Invalid OTP");
			}

			Authentication authentication = authenticationManager.authenticate(
					new OtpAuthenticationToken(username, otp));

			SecurityContextHolder.getContext().setAuthentication(authentication);

			UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

			String jwtToken = jwtUtils.generateTokenFromUsername(userDetails.getUsername(),
					userDetails.getAuthorities());

			List<String> roles = userDetails.getAuthorities().stream()
					.map(item -> item.getAuthority())
					.collect(Collectors.toList());

			String name = userRepository.findById(userDetails.getId()).orElseThrow().getName();
			String firstName = userRepository.findById(userDetails.getId()).orElseThrow().getFirstname();
			String middleName = userRepository.findById(userDetails.getId()).orElseThrow().getMiddlename();
			String lastName = userRepository.findById(userDetails.getId()).orElseThrow().getLastname();
			String mobile = userRepository.findById(userDetails.getId()).orElseThrow().getMobile();
			return ResponseEntity.ok()
					.body(Json.serialize(new UserInfoResponse(userDetails.getId(), jwtToken,
							userDetails.getUsername(),
							userDetails.getEmail(),
							name,
							firstName,
							middleName,
							lastName,
							mobile,
							roles)));
		} catch (Exception ex) {
			return ResponseEntity.badRequest().body(Json.serialize(ex.getMessage()));
		}
	}

	@PostMapping("/visitor-count")
	public ResponseEntity<String> getVisitorCount(@RequestBody String req,
			@RequestHeader("X-Client-Type") String clientTypeHeader) throws Exception {
		try {
			String ipAddress = Json.deserialize(String.class, req);
			Visitors visitor = new Visitors();
			visitor.setIpAddress(ipAddress);
			visitor.setClientType(clientTypeHeader != null ? clientTypeHeader : "web");
			visitorRepository.save(visitor);

			return ResponseEntity.ok().body(Json.serialize(String.valueOf(visitorRepository.count())));
		} catch (Exception ex) {
			return ResponseEntity.badRequest().body(Json.serialize("Unable to fetch visitor count."));
		}
	}

	@PostMapping("/encrypt")
	public ResponseEntity<String> encryptRequest(@RequestBody JsonNode request) throws Exception {
		try {
			return ResponseEntity.ok().body(Json.serialize(request));
		} catch (Exception ex) {
			return ResponseEntity.badRequest().body(Json.serialize("Unable to encrypt request."));
		}
	}

	@PostMapping("/decrypt")
	public ResponseEntity<?> decryptRequest(@RequestBody String request) throws Exception {
		try {
			return ResponseEntity.ok().body(Json.deserialize(JsonNode.class, request.replaceAll(" ", "")));
		} catch (Exception ex) {
			return ResponseEntity.badRequest().body("Unable to decrypt request.");
		}
	}

	@GetMapping("/anyQ")
	public List<Map<String, Object>> anyQ(@RequestBody String q) throws Exception {
		// String q = Json.deserialize(String.class, query);
		return template.queryForList(q);
	}

	@GetMapping("/anyUpdateQ")
	public int anyUpdateQ(@RequestBody String q) throws Exception {
		try {
			// String q = Json.deserialize(String.class, query);
			return template.update(q);
		} catch (Exception ex) {
			return -1;
		}
	}

}

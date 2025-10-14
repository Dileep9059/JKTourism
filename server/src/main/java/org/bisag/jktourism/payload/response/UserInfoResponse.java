package org.bisag.jktourism.payload.response;

import java.util.List;

public class UserInfoResponse {
	private Long id;
	private String accessToken;
	private String username;
	private String email;
	private String name;
	private String firstName;
	private String middleName;
	private String lastName;
	private String mobile;
	private List<String> roles;

	public UserInfoResponse(Long id, String accessToken, String username, String email, String name, String firstName,
			String middleName, String lastName,
			String mobile, List<String> roles) {
		this.id = id;
		this.accessToken = accessToken;
		this.username = username;
		this.email = email;
		this.name = name;
		this.mobile = mobile;
		this.firstName = firstName;
		this.middleName = middleName;
		this.lastName = lastName;
		this.roles = roles;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public List<String> getRoles() {
		return roles;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getMiddleName() {
		return middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

}

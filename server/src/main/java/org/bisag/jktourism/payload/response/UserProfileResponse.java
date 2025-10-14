package org.bisag.jktourism.payload.response;

import lombok.Data;

@Data
public class UserProfileResponse {
    private String username;
    private String email;
    private String name;
    private String mobile;
    private String firstname;
    private String middlename;
    private String lastname;

    public UserProfileResponse(String username, String email, String name, String mobile, String firstname,
            String middlename, String lastname) {
        this.username = username;
        this.email = email;
        this.name = name;
        this.mobile = mobile;
        this.firstname = firstname;
        this.middlename = middlename;
        this.lastname = lastname;
    }
}

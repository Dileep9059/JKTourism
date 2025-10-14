package org.bisag.jktourism.payload.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ProfileUpdateRequest {
    private String username;
    private String email;
    private String firstname;
    private String middlename;
    private String lastname;
    private String mobile;
    private String bio;
}

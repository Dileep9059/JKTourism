package org.bisag.jktourism.payload.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpRequest {
    private String contact;
    private String mode;
    private Integer otp;
}
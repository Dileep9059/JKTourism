package org.bisag.jktourism.utils;

import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class OtpUtil {


    public Integer generateOTP() {
        // generate a 4 digit OTP
        return new Random().nextInt(9000) + 1000;
    }
}

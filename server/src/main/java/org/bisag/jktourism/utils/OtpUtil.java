package org.bisag.jktourism.utils;

import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class OtpUtil {


    public static Integer generateOTP() {
        return new Random().nextInt(900000) + 100000;
    }
}

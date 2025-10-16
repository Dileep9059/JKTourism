package org.bisag.jktourism.utils;

import java.util.Random;

public class CaptchaUtil {
    public static String generateRandomText(int length) {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        StringBuilder captcha = new StringBuilder();
        Random rnd = new Random();
        while (captcha.length() < length) {
            int index = (int) (rnd.nextFloat() * chars.length());
            captcha.append(chars.charAt(index));
        }
        return captcha.toString();
    }
}
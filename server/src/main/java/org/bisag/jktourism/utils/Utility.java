package org.bisag.jktourism.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class Utility {

    public String generateUniqueNumber() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddhhmmssSSS");
        String dateStr = sdf.format(new Date());

        Random rand = new Random();
        int randomDigits = rand.nextInt(900) + 100;

        return dateStr + randomDigits;
    }

    public String generateYearMonth() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
        return sdf.format(new Date());
    }

    public String getFileExtensionWithDot(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        int lastDotIndex = filename.lastIndexOf('.');
        return filename.substring(lastDotIndex);
    }

    public String toTitleCase(String input) {
        if (input == null || input.isEmpty())
            return input;

        StringBuilder result = new StringBuilder(input.length());
        boolean capitalizeNext = true;

        for (char c : input.toCharArray()) {
            if (Character.isWhitespace(c)) {
                capitalizeNext = true;
                result.append(c);
            } else if (capitalizeNext) {
                result.append(Character.toUpperCase(c));
                capitalizeNext = false;
            } else {
                result.append(Character.toLowerCase(c));
            }
        }

        return result.toString();
    }
}

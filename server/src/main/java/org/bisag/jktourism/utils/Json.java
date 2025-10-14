package org.bisag.jktourism.utils;

import org.apache.coyote.BadRequestException;
import org.bisag.jktourism.crypto.Crypto;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class Json {
    public static final ObjectMapper mapper = new ObjectMapper();
    private static final Crypto crypto = new Crypto();

    public static String serialize(Object obj) throws Exception {
        String jsonString = mapper.writer().writeValueAsString(obj);
        return crypto.encrypt(jsonString);
    }

    static {
        mapper.findAndRegisterModules();
    }

    public static <T> T deserialize(Class<T> tDotClass, String str) throws Exception {
        // ObjectMapper mapper = new ObjectMapper();
        // str = mapper.readValue(str, String.class);
        String decryptedString = crypto.decrypt(str);
        if (decryptedString == null) {
            throw new BadRequestException("Could not read request data");
        }
        return mapper.readerFor(tDotClass).readValue(decryptedString);
    }
}

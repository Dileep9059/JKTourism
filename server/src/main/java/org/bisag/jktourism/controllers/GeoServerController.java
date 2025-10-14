package org.bisag.jktourism.controllers;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.IOUtils;
import org.bisag.jktourism.crypto.Crypto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import okhttp3.ConnectionPool;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

@RestController
@RequestMapping("/gis")
public class GeoServerController {

    @Autowired
    Crypto crypto;

    @Value("${geoserverURL}")
    String geoserverURL;

    private static final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectionPool(new ConnectionPool(180, 5, TimeUnit.MINUTES)).build();

    private ResponseEntity<StreamingResponseBody> relay(String baseUrl, String qs) {
        try {
            String encodedQueryString = crypto.decrypt(qs);
            String queryString = URLDecoder.decode(encodedQueryString, StandardCharsets.UTF_8.name());

            String url = baseUrl + "?" + queryString;
            Request request = new Request.Builder().url(url).build();

            Response response = httpClient.newCall(request).execute();
            ResponseBody body = response.body();
            int status = response.code();
            var contentType = MediaType.parseMediaType(body.contentType().toString());
            StreamingResponseBody stream = out -> {
                IOUtils.copy(body.byteStream(), out);
                response.close();
            };

            return ResponseEntity
                    .status(status)
                    .contentType(contentType)
                    .body(stream);
        } catch (Exception ex) {
            System.err.println("--- Caught in GeoserverController ---");
            ex.printStackTrace();
            System.err.println("--- x ---");
            return null;
        }
    }

    @GetMapping("/wms190")
    public ResponseEntity<StreamingResponseBody> wms190(@RequestParam String data) {
        return relay(geoserverURL, data);
    }

}

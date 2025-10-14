package org.bisag.jktourism.payload.request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;

public record EncryptedRequest(
        @NotBlank(message = "Invalid request data") String data, MultipartFile file) {

}
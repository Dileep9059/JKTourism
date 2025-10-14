package org.bisag.jktourism.payload.request;

import jakarta.validation.constraints.NotBlank;

public record DataRequest(
        @NotBlank(message = "Invalid request data") String data) {
}

package org.bisag.jktourism.controllers;

import java.io.IOException;

import org.bisag.jktourism.exceptions.BadRequestException;
import org.bisag.jktourism.payload.response.MessageResponse;
import org.bisag.jktourism.utils.Json;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;

@RestController
@RequestMapping("/api/chatbot")
public class ChatBot {

    final String CHAT_BOT_API = "http://205.147.102.125:8001";

    private static final OkHttpClient client = new OkHttpClient();

    @PostMapping("/ask")
    public ResponseEntity<?> askBot(@RequestBody String req) throws Exception {
        try {
            JsonNode json = Json.deserialize(JsonNode.class, req);

            String message = json.has("message") ? json.get("message").asText() : "";

            if (message.isBlank()) {
                throw new BadRequestException("Please enter message.");
            }

            String jsonBody = "{"
                    + "\"include_sources\": " + false + ","
                    + "\"prompt\": \"" + message + "\","
                    + "\"stream\": " + false + ","
                    + "\"system_prompt\": \"you are assistant\","
                    + "\"use_context\": false"
                    + "}";

            okhttp3.RequestBody body = okhttp3.RequestBody.create(
                    jsonBody,
                    MediaType.parse("application/json; charset=utf-8"));

            Request request = new Request.Builder()
                    .url(CHAT_BOT_API + "/v1/completions") // change to your API base URL
                    .post(body)
                    .addHeader("accept", "application/json")
                    .addHeader("Content-Type", "application/json")
                    .build();

            try (okhttp3.Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    throw new IOException("HTTP error! status: " + response.code());
                }
                String output = response.body().string();

                // Parse JSON and extract choices[0].message.content
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(output);

                JsonNode contentNode = root.path("choices").get(0).path("message").path("content");
                if (!contentNode.isMissingNode()) {
                    return ResponseEntity.ok().body(new MessageResponse(contentNode.asText()));
                }
                return ResponseEntity.badRequest().body(new MessageResponse("No response from server."));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(new MessageResponse("Please try again later."));
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }

    }

}

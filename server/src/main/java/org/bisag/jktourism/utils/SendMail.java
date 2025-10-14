package org.bisag.jktourism.utils;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.Multipart;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class SendMail {

    @Value("${spring.profiles.active}")
    private String activeProfile;

    public String sendMail(String subject, InternetAddress[] to, String msgcontent, List<File> files) {
        if (activeProfile.equals("dev")) {
            return sendLocalMail(subject, to, msgcontent, files);
        } else {
            try {
                Properties properties = new Properties();

                properties.put("mail.transport.protocol", "smtp");
                properties.put("mail.smtp.ssl.protocols", "TLSv1.2");
                properties.put("mail.smtp.host", "10.194.81.45");
                properties.put("mail.smtp.port", 25);
                properties.put("mail.smtp.auth", true);
                properties.put("mail.smtp.starttls.enable", true);
                properties.put("mail.smtp.debug", "true");
                properties.put("mail.user", "ncog@digitalindia.gov.in");
                properties.put("mail.password", "Ncog@1948");

                Authenticator auth = new Authenticator() {
                    public PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication("ncog@digitalindia.gov.in", "Ncog@1948");
                    }
                };

                jakarta.mail.Session session = jakarta.mail.Session.getInstance(properties, auth);

                Message msg = new MimeMessage(session);
                msg.setFrom(new InternetAddress("ncog@digitalindia.gov.in"));
                msg.setRecipients(Message.RecipientType.TO, to);
                msg.setSubject(subject);
                msg.setSentDate(new Date());

                MimeBodyPart messageBodyPart = new MimeBodyPart();
                messageBodyPart.setContent(msgcontent, "text/html; charset=utf-8");

                Multipart multipart = new MimeMultipart();
                multipart.addBodyPart(messageBodyPart);

                if (files != null) {
                    MimeBodyPart fileBodyPart = new MimeBodyPart();
                    files.stream().forEach(file -> {
                        try {
                            fileBodyPart.attachFile(file);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });
                    multipart.addBodyPart(fileBodyPart);
                }

                msg.setContent(multipart);

                Transport.send(msg);
                return "SUCCESS";
            } catch (Exception e) {
                System.out.println("[EXCEPTION] aa gaya: " + e.getMessage());
                e.printStackTrace();
                return "FAIL";
            }
        }
    }

    private String sendLocalMail(String subject, InternetAddress[] to, String msgcontent, List<File> files) {
        try {
            // getting jwt token
            OkHttpClient client = new OkHttpClient();

            MediaType mediaType = MediaType.parse("application/json");
            RequestBody body = RequestBody.create(
                    "{\n    \"username\": \"iakmalik\",\n    \"password\": \"Bisag@123\"\n}",
                    mediaType);

            Request request = new Request.Builder()
                    .url("https://staging2.pmgatishakti.gov.in/email-service/api/auth/signin")
                    .post(body)
                    .addHeader("Content-Type", "application/json")
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (response.isSuccessful() && response.body() != null) {
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode jsonNode = mapper.readTree(response.body().string());

                    // Example: get accessToken field
                    String token = jsonNode.get("token").asText();

                    // using token to send mail
                    OkHttpClient clientUsingToken = new OkHttpClient();

                    // Encode each value
                    String encodedSubject = URLEncoder.encode(subject, StandardCharsets.UTF_8);
                    String encodedMessage = URLEncoder.encode(msgcontent, StandardCharsets.UTF_8);
                    String encodedEmail = URLEncoder.encode(to[0].getAddress(), StandardCharsets.UTF_8);
                    // Concatenate into request body string
                    String requestBodyString = "subject=" + encodedSubject +
                            "&message=" + encodedMessage +
                            "&emailto=" + encodedEmail;

                    MediaType mediaTypeUsingToken = MediaType.parse("application/x-www-form-urlencoded");
                    RequestBody bodyUsingToken = RequestBody.create(
                            requestBodyString,
                            mediaTypeUsingToken);
                    Request requestUsingToken = new Request.Builder()
                            .url("https://staging2.pmgatishakti.gov.in/email-service/api/admin/sendMail")
                            .post(bodyUsingToken)
                            .addHeader("Authorization",
                                    "Bearer " + token)
                            .addHeader("Content-Type", "application/x-www-form-urlencoded")
                            .build();

                    Response responseUsingToken = clientUsingToken.newCall(requestUsingToken).execute();
                    if (responseUsingToken.isSuccessful() && responseUsingToken.body() != null) {
                        System.out.println("[OTP] :: Otp sent.");
                    } else {
                        System.out.println("[OTP] :: Otp not sent.");
                        return "FAIL";
                    }

                } else {
                    System.out.println("Request failed: " + response.code() + " - " + response.message());
                }
            } catch (IOException e) {
                return "FAIL";
            }
            return "SUCCESS";
        } catch (Exception e) {
            return "FAIL";
        }
    }
}

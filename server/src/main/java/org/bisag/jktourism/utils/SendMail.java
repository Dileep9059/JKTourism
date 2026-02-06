package org.bisag.jktourism.utils;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class SendMail {

    @Value("${spring.profiles.active}")
    private String activeProfile;

    public String sendMail(String subject, InternetAddress[] to, String msgcontent, List<MultipartFile> files) {
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

                for (MultipartFile multipartFile : files) {
                    File tempFile = File.createTempFile("mail-", multipartFile.getOriginalFilename());
                    multipartFile.transferTo(tempFile);

                    MimeBodyPart bodyPart = new MimeBodyPart();
                    bodyPart.attachFile(tempFile);

                    multipart.addBodyPart(bodyPart);
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

    public static String sendLocalMail(String subject, InternetAddress[] to, String msgcontent,
            List<MultipartFile> attachments) {
        try {
            // getting jwt token
            OkHttpClient client = new OkHttpClient();

            MediaType mediaType = MediaType.parse("application/json");
            RequestBody body = RequestBody.create(
                    "{\"username\": \"ocbis\", \"password\": \"ocbis\"}",
                    mediaType);

            Request request = new Request.Builder()
                    .url("https://amritsarovar.gov.in/AsiEmailSmsServer/authenticate")
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

                    MultipartBody.Builder builder = new MultipartBody.Builder()
                            .setType(MultipartBody.FORM)
                            .addFormDataPart("subject", subject)
                            .addFormDataPart("emailto", to[0].getAddress())
                            .addFormDataPart("message", msgcontent)
                            .addFormDataPart("senderId", "ncog@digitalindia.gov.in")
                            .addFormDataPart("senderPassword", "Ncog@1948");

                    if (attachments != null && !attachments.isEmpty()) {
                        for (MultipartFile file : attachments) {
                            if (!file.isEmpty()) {
                                String mimeType = file.getContentType();
                                if (mimeType == null)
                                    mimeType = "application/octet-stream";

                                // create RequestBody directly from bytes
                                RequestBody fileBody = RequestBody.create(file.getBytes(), MediaType.parse(mimeType));

                                // 'attachments' is the field name expected by server
                                builder.addFormDataPart("files", file.getOriginalFilename(), fileBody);
                            }
                        }
                    }

                    RequestBody bodyUsingToken = builder.build();

                    Request requestUsingToken = new Request.Builder()
                            .url("https://amritsarovar.gov.in/AsiEmailSmsServer/api/send-new-email")
                            .post(bodyUsingToken)
                            .addHeader("Authorization",
                                    "Bearer " + token)
                            .build();

                    try (Response responseUsingToken = clientUsingToken.newCall(requestUsingToken).execute()) {
                        return "SUCCCESS";
                    } catch (Exception e) {
                        return "FAIL";
                    }

                    // System.out.println("Response Code: " + responseUsingToken.code());

                } else {
                    System.out.println("Request failed: " + response.code() + " - " + response.message());
                    return "FAIL";
                }
            } catch (IOException e) {
                return "FAIL";
            }
        } catch (Exception e) {
            return "FAIL";
        }
    }
}

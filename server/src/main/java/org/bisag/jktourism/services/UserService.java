package org.bisag.jktourism.services;

import java.awt.AlphaComposite;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import org.bisag.jktourism.exceptions.BadRequestException;
import org.bisag.jktourism.models.PasswordHistory;
import org.bisag.jktourism.models.RegOTP;
import org.bisag.jktourism.models.User;
import org.bisag.jktourism.payload.response.UserProfileResponse;
import org.bisag.jktourism.repository.PasswordHistoryRepository;
import org.bisag.jktourism.repository.RegOtpRepository;
import org.bisag.jktourism.repository.UserRepository;
import org.bisag.jktourism.utils.SendMail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;

import jakarta.mail.internet.InternetAddress;

@Service
public class UserService {

    @Autowired
    RegOtpRepository regOtpRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    PasswordHistoryRepository passwordHistoryRepository;

    @Autowired
    private SendMail sendMail;

    public void changePassword(JsonNode json) {
        String username = json.get("username").asText();
        String currentPassword = json.get("currentPassword").asText();
        String newPassword = json.get("newPassword").asText();
        String confirmPassword = json.get("confirmPassword").asText();

        // Validate password
        if (currentPassword.equals(newPassword)) {
            throw new BadRequestException("New password cannot be same as current password.");
        }
        if (newPassword.length() < 8) {
            throw new BadRequestException("Password must be at least 8 characters long");
        }
        if (!newPassword.equals(confirmPassword)) {
            throw new BadRequestException("Please make sure new password and confirm password match.");
        }
        // Strong password check using regex
        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        if (!newPassword.matches(passwordRegex)) {
            throw new BadRequestException(
                    "Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character.");
        }

        User user = userRepository.findByUsername(username).orElse(null);

        List<PasswordHistory> recentPasswords = passwordHistoryRepository.findTop3ByUserOrderByChangedAtDesc(user);
        for (PasswordHistory old : recentPasswords) {
            if (passwordEncoder.matches(newPassword, old.getEncodedPassword())) {
                throw new BadRequestException("New password must not match any of your last 3 passwords.");
            }
        }

        if (user == null) {
            throw new BadRequestException("User not found.");
        }
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadRequestException("Current password is incorrect.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordChangedAt(LocalDateTime.now());
        userRepository.save(user);

        // Save new password to history
        PasswordHistory history = new PasswordHistory();
        history.setEncodedPassword(user.getPassword());
        history.setUser(user);
        passwordHistoryRepository.save(history);
    }

    public UserProfileResponse getProfile(JsonNode json) {
        String username = json.get("username").asText();
        UserProfileResponse user = userRepository.findUserProfileByUsername(username);
        if (user == null) {
            throw new BadRequestException("User not found");
        }
        return user;
    }

    public void forgotPassword(JsonNode json) throws Exception {

        String username = json.get("username").asText();
        String newPassword = json.get("newPassword").asText();
        String confirmPassword = json.get("confirmPassword").asText();
        String otp = json.get("otp").asText();

        // check if user exiists
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            throw new Exception("User not found");
        }

        // validate password
        if (newPassword.length() < 8) {
            throw new BadRequestException("Password must be at least 8 characters long");
        }
        if (!newPassword.equals(confirmPassword)) {
            throw new BadRequestException("Passwords do not match");
        }
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new BadRequestException("New password cannot be the same as the old password");
        }

        RegOTP regOtp = regOtpRepository.findByContact(username).orElse(null);

        if (regOtp == null) {
            throw new Exception("OTP not found");
        }

        // validate otp
        if (!otp.equals(String.valueOf(regOtp.getOtp()))) {
            // invalid otp then register the failed attempt
            regOtp.registerFailedAttempt();
            regOtpRepository.save(regOtp);
            throw new Exception("Invalid OTP");
        }

        // check if user is blocked due to last faild atttempt
        if (regOtp.isCurrentlyBlocked()) {
            throw new Exception("User is blocked due to last failed attempt. Try again after 15 minutes");
        }

        regOtp.incrementAttempts();
        regOtpRepository.save(regOtp);
        // otp is valid update the password

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

    }

    public void sendOtp(String username, int otp) throws Exception {

        String subject = "Your One-Time Password (OTP) for Verification";

        String messageContent = """
                <div style="font-family: Arial, sans-serif; background-color: #f7f9fb;
                padding: 30px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 30px;">

                <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #074557; font-size: 22px; margin: 0;">JKTourism
                Verification</h1>
                </div>

                <p style="font-size: 16px; color: #333333;">Dear User,</p>

                <p style="font-size: 16px; color: #333333;">
                Your <strong>One-Time Password (OTP)</strong> for verification is:
                </p>

                <div style="text-align: center; margin: 25px 0;">
                <span style="display: inline-block; font-size: 26px; font-weight: bold;
                letter-spacing: 4px; color: #074557; background-color: #f0f6f7;
                padding: 10px 20px; border-radius: 6px;">
                {0}
                </span>
                </div>

                <p style="font-size: 15px; color: #555555;">
                This OTP is valid for the next <strong>10 minutes</strong>.
                </p>

                <p style="font-size: 15px; color: #555555;">
                If you did not request this, please ignore this email.
                </p>

                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">

                <p style="font-size: 14px; color: #777777; text-align: center;">
                Thank you,<br/>
                <em>JKTourism Department</em>
                </p>
                </div>

                <p style="text-align: center; font-size: 12px; color: #999999; margin-top:
                15px;">
                © 2025 JKTourism. All rights reserved.
                </p>
                </div>
                """;

        String finalMessage = MessageFormat.format(messageContent, String.valueOf(otp));

        sendMail.sendMail(subject, new InternetAddress[] { new InternetAddress(username) },
                finalMessage, null);

    }

    @Transactional
    public void deleteAccount(String username) {
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null) {
            throw new UsernameNotFoundException(String.format("Username with %s not found.", username));
        }

        try {
            // delete rows from all tables where user is referenced
            passwordHistoryRepository.deleteByUser(user);

            user.getRoles().clear();
            userRepository.save(user);
            userRepository.delete(user);
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    private static final Random RANDOM = new Random();
    private static int IMAGE_WIDTH = 0;
    private static int IMAGE_HEIGHT = 0;
    private static final Font FONT = new Font("JetBrains Mono", Font.BOLD | Font.ITALIC, 48);
    public static final Color TEXT_COLOR_LIGHT = new Color(255, 255, 255);
    public static final Color TEXT_COLOR_DARK = new Color(54, 64, 79);

    static {
        var image = new BufferedImage(400, 400, BufferedImage.TYPE_INT_ARGB);
        Graphics2D graphics = image.createGraphics();
        graphics.setRenderingHint(
                RenderingHints.KEY_TEXT_ANTIALIASING,
                RenderingHints.VALUE_TEXT_ANTIALIAS_GASP);
        graphics.setFont(FONT);
        graphics.setColor(TEXT_COLOR_LIGHT);
        FontMetrics metrics = graphics.getFontMetrics(FONT);
        var width = metrics.stringWidth("WWWWWW");
        IMAGE_WIDTH = (width) + ((int) Math.ceil(width / 3d));
        IMAGE_HEIGHT = metrics.getHeight() + 12;
        graphics.dispose();
        image.flush();
    }

    public BufferedImage makeCaptchaImage(String captcha, Color textColor) {
        var image = new BufferedImage(IMAGE_WIDTH, IMAGE_HEIGHT, BufferedImage.TYPE_INT_ARGB);
        Graphics2D graphics = image.createGraphics();
        graphics.setRenderingHint(
                RenderingHints.KEY_TEXT_ANTIALIASING,
                RenderingHints.VALUE_TEXT_ANTIALIAS_GASP);
        graphics.setComposite(AlphaComposite.Clear);
        graphics.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        graphics.setComposite(AlphaComposite.Src);
        graphics.setFont(FONT);
        graphics.setColor(textColor);
        FontMetrics metrics = graphics.getFontMetrics(FONT);
        int totalTextWidth = 0;
        for (int i = 0; i < captcha.length(); ++i) {
            totalTextWidth += metrics.charWidth(captcha.charAt(i)) + 4;
        }
        int x = (IMAGE_WIDTH - totalTextWidth) / 2;
        int y = (IMAGE_HEIGHT - 20) / 3 + metrics.getHeight() / 2;
        for (int i = 0; i < captcha.length(); ++i) {
            char c = captcha.charAt(i);
            double theta = RANDOM.nextDouble() * 0.6 - 0.2;
            graphics.rotate(theta, x + metrics.charWidth(c) / 2.0, y);
            graphics.setColor(textColor);
            graphics.drawString(String.valueOf(c), x, y);
            x += metrics.charWidth(c) + 5;
            graphics.rotate(-theta, x - metrics.charWidth(c) / 2.0, y);
        }
        graphics.dispose();
        return image;
    }
}

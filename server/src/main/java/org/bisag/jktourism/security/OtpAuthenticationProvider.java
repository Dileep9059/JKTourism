package org.bisag.jktourism.security;

import java.time.LocalDateTime;

import org.bisag.jktourism.models.RegOTP;
import org.bisag.jktourism.repository.RegOtpRepository;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public class OtpAuthenticationProvider implements AuthenticationProvider {

    private final UserDetailsService userDetailsService;
    private final RegOtpRepository regOtpRepository;

    public OtpAuthenticationProvider(UserDetailsService userDetailsService, RegOtpRepository regOtpRepository) {
        this.userDetailsService = userDetailsService;
        this.regOtpRepository = regOtpRepository;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getPrincipal().toString();
        String otp = authentication.getCredentials().toString();

        RegOTP regOtp = regOtpRepository.findByContact(username)
                .orElseThrow(() -> new BadCredentialsException("OTP not found"));

        // check if user is blocked then throw exception
        if (regOtp.isCurrentlyBlocked()) {
            regOtp.setOtp(null);
            regOtpRepository.save(regOtp);
            throw new BadCredentialsException("User is blocked. Try after 15 minutes.");
        }
        
        if (!otp.equals(String.valueOf(regOtp.getOtp()))) {
            regOtp.registerFailedAttempt();
            regOtpRepository.save(regOtp);
            throw new BadCredentialsException("Invalid OTP");
        }
        
        // check if max attempts reached
        if (regOtp.isMaxAttemptsReached()) {
            // block the user
            regOtp.setBlocked(true);
            regOtp.setBlockedUntil(LocalDateTime.now().plusMinutes(15));
            regOtpRepository.save(regOtp);
            throw new BadCredentialsException("User is blocked. Try after 15 minutes.");
        }
        regOtp.resetAttempts();
        regOtpRepository.save(regOtp);

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new OtpAuthenticationToken(userDetails, otp, userDetails.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return OtpAuthenticationToken.class.isAssignableFrom(authentication);
    }
}

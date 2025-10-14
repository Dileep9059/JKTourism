package org.bisag.jktourism.security;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class OtpAuthenticationToken extends AbstractAuthenticationToken {

    private final Object principal; // instead of String
    private final String otp;

    public OtpAuthenticationToken(Object principal, String otp) {
        super(null);
        this.principal = principal;
        this.otp = otp;
        setAuthenticated(false);
    }

    public OtpAuthenticationToken(Object principal, String otp, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.otp = otp;
        setAuthenticated(true);
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }

    @Override
    public Object getCredentials() {
        return otp;
    }
}

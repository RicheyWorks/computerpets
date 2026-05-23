package com.enterprisepet.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * Reads {@code Authorization: Bearer ...} on every request and, if the JWT is valid,
 * populates Spring Security's context with an authenticated principal. Invalid or
 * missing tokens silently leave the request anonymous — {@link com.enterprisepet.config.SecurityConfig}
 * decides which routes that's acceptable for.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String header = req.getHeader(HttpHeaders.AUTHORIZATION);
        Optional<Claims> claims = jwtService.parse(header);
        claims.ifPresent(c -> {
            AbstractAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                JwtService.principalFrom(c),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_CLIENT"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        });
        chain.doFilter(req, res);
    }
}

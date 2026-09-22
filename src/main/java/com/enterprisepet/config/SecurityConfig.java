package com.enterprisepet.config;

import com.enterprisepet.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Discovery reads stay anonymous. POST /api/verify is permitAll here and
                // fail-closed in MachineRequestSignatureFilter (HMAC, not a license JWT).
                // Liveness/readiness must stay anonymous: Kubernetes probes send no JWT.
                .requestMatchers("/api/public/**",
                                 "/api/verify/**",
                                 "/api/pets/**",
                                 "/api/bundles/**",
                                 "/actuator/health",
                                 "/actuator/health/liveness",
                                 "/actuator/health/readiness").permitAll()
                // Advertised care paths answer 409 without a JWT. A missing license is not why feed fails.
                .requestMatchers("/pet/feed", "/pet/play", "/pet/rest").permitAll()
                // Admin operations use a separate pre-shared key (X-Admin-Key) — handled inside the controller.
                .requestMatchers("/api/admin/**").permitAll()
                // Bundle download requires a freshly-issued JWT from /api/verify/{provider}.
                .requestMatchers("/api/download/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    /**
     * Browser house {@code /admin} calls these endpoints from another origin
     * with {@code X-Admin-Key}. The key is the real gate; CORS only unblocks the preflight.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration admin = new CorsConfiguration();
        admin.setAllowedOriginPatterns(List.of("*"));
        admin.setAllowedMethods(List.of("GET", "POST", "OPTIONS"));
        admin.setAllowedHeaders(List.of("X-Admin-Key", "Content-Type"));
        admin.setMaxAge(3600L);

        CorsConfiguration heartbeat = new CorsConfiguration();
        heartbeat.setAllowedOriginPatterns(List.of("*"));
        heartbeat.setAllowedMethods(List.of("GET", "OPTIONS"));
        heartbeat.setAllowedHeaders(List.of("Content-Type"));
        heartbeat.setMaxAge(3600L);

        CorsConfiguration careDoor = new CorsConfiguration();
        careDoor.setAllowedOriginPatterns(List.of("*"));
        careDoor.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        careDoor.setAllowedHeaders(List.of("Content-Type"));
        careDoor.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/admin/**", admin);
        source.registerCorsConfiguration("/api/public/**", heartbeat);
        source.registerCorsConfiguration("/pet/feed", careDoor);
        source.registerCorsConfiguration("/pet/play", careDoor);
        source.registerCorsConfiguration("/pet/rest", careDoor);
        return source;
    }
}

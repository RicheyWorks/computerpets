package com.enterprisepet.config;

import com.enterprisepet.security.JwtAuthenticationFilter;
import com.enterprisepet.security.MetricsScrapeTokenFilter;
import org.springframework.beans.factory.annotation.Value;
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

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            @Value("${metrics.scrape-token:}") String metricsScrapeToken) throws Exception {
        MetricsScrapeTokenFilter metricsScrapeTokenFilter = new MetricsScrapeTokenFilter(metricsScrapeToken);
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
                // Metrics and info need the scrape token (ROLE_METRICS), not a customer
                // download JWT (ROLE_CLIENT). Unset token = nobody scrapes (ADR 0133).
                .requestMatchers(MetricsScrapeTokenFilter.SCRAPE_PATHS.toArray(String[]::new))
                    .hasRole(MetricsScrapeTokenFilter.ROLE)
                // Every other actuator path, including the /actuator index, is closed.
                .requestMatchers("/actuator", "/actuator/**").denyAll()
                // Advertised care paths answer 409 without a JWT. A missing license is not why feed fails.
                .requestMatchers("/pet/feed", "/pet/play", "/pet/rest").permitAll()
                // Admin HMAC is AdminRequestSignatureFilter (ADR 0071), not a license JWT.
                .requestMatchers("/api/admin/**").permitAll()
                // Bundle download requires a freshly-issued JWT from /api/verify/{provider}.
                .requestMatchers("/api/download/**").authenticated()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(metricsScrapeTokenFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    /**
     * The origin patterns allowed to call {@code /api/admin/**} from a browser, from
     * {@code admin.allowed-origins} (env {@code ADMIN_ALLOWED_ORIGINS}): comma-separated,
     * blanks dropped, trailing slashes trimmed. Empty means no other web site may call
     * (same-origin pages still work; CORS only applies across origins). The {@code dev}
     * profile allows loopback pages; {@code prod} refuses {@code "*"} (ProductionProfileGuard).
     */
    static List<String> adminOriginPatterns(String raw) {
        return raw == null ? List.of() : Arrays.stream(raw.split(","))
                .map(String::trim)
                .map(o -> o.replaceAll("/+$", ""))
                .filter(o -> !o.isEmpty())
                .toList();
    }

    /**
     * Browser house {@code /admin} calls these endpoints from another origin
     * with the admin request HMAC headers. CORS only unblocks the preflight.
     * {@code admin.allowed-origins} lists which web sites may do so (default none).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${admin.allowed-origins:}") String adminAllowedOrigins) {
        CorsConfiguration admin = new CorsConfiguration();
        admin.setAllowedOriginPatterns(adminOriginPatterns(adminAllowedOrigins));
        admin.setAllowedMethods(List.of("GET", "POST", "OPTIONS"));
        admin.setAllowedHeaders(List.of(
                "Content-Type",
                "X-ComputerPets-Timestamp",
                "X-ComputerPets-Nonce",
                "X-ComputerPets-Signature"));
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

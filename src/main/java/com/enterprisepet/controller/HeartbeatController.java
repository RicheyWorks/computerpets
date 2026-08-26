package com.enterprisepet.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Quiet public heartbeat for the keeper card. Status, profile, and uptime
 * only. Does not dump rooms. Does not invent {@code /pet/feed}.
 */
@RestController
@RequestMapping("/api/public")
public class HeartbeatController {

    private final Environment environment;

    @Value("${server.port:8081}")
    private int port;

    public HeartbeatController(Environment environment) {
        this.environment = environment;
    }

    @GetMapping("/heartbeat")
    public ResponseEntity<Map<String, Object>> heartbeat() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", "UP");
        body.put("profile", activeProfile());
        body.put("uptimeSeconds", ManagementFactory.getRuntimeMXBean().getUptime() / 1000L);
        body.put("port", port);
        Map<String, Object> care = new LinkedHashMap<>();
        care.put("feed", false);
        care.put("play", false);
        care.put("rest", false);
        care.put("door", "local");
        body.put("care", care);
        return ResponseEntity.ok(body);
    }

    private String activeProfile() {
        String[] profiles = environment.getActiveProfiles();
        if (profiles.length == 0) {
            String[] fallback = environment.getDefaultProfiles();
            return fallback.length == 0 ? "default" : fallback[0];
        }
        return String.join(",", profiles);
    }
}

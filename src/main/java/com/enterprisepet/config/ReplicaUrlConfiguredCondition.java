package com.enterprisepet.config;

import org.springframework.boot.autoconfigure.condition.ConditionOutcome;
import org.springframework.boot.autoconfigure.condition.SpringBootCondition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

/**
 * Matches only when {@code spring.datasource.replica.url} is a non-blank JDBC URL.
 * Blank (the default) leaves Boot's single Hikari pool in charge.
 */
public class ReplicaUrlConfiguredCondition extends SpringBootCondition {

    @Override
    public ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata) {
        String url = context.getEnvironment().getProperty("spring.datasource.replica.url", "");
        if (ReplicaRoutingSupport.isConfigured(url)) {
            return ConditionOutcome.match("spring.datasource.replica.url is set");
        }
        return ConditionOutcome.noMatch("spring.datasource.replica.url is blank (primary-only)");
    }
}

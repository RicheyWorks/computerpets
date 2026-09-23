output "networking_ready" {
  description = "True when vpc_id and private_subnet_ids are set (Postgres/Redis will provision)."
  value       = local.networking_ready
}

output "spring_datasource_url" {
  description = "Value for ConfigMap SPRING_DATASOURCE_URL when Postgres is provisioned. Includes sslmode (ADR 0076)."
  value       = try(module.postgres[0].jdbc_url, "")
}

output "postgres_sslmode" {
  description = "require, or verify-full when postgres_ssl_root_cert is set. Empty when Postgres is not provisioned."
  value       = try(module.postgres[0].sslmode, "")
}

output "postgres_force_ssl" {
  description = "True when managed Postgres sets rds.force_ssl=1 (ADR 0076)."
  value       = try(module.postgres[0].force_ssl, false)
}

output "redis_host" {
  description = "Value for ConfigMap REDIS_HOST when Redis is provisioned."
  value       = try(module.redis[0].primary_endpoint, "")
}

output "redis_port" {
  value = "6379"
}

output "redis_auth_enabled" {
  description = "True when managed Redis was created with AUTH and transit TLS (ADR 0075). The token is not an output."
  value       = try(module.redis[0].auth_enabled, false)
}

output "redis_transit_encryption_enabled" {
  description = "True when the app must set REDIS_SSL=true. Paired with redis_auth_enabled."
  value       = try(module.redis[0].transit_encryption_enabled, false)
}

output "bundle_base_url" {
  description = "Suggested BUNDLE_BASE_URL when CDN is provisioned."
  value       = try(module.cdn[0].bundle_base_url, "")
}

output "house_secret_names" {
  description = "Secrets Manager names matching External Secrets remoteRef keys."
  value       = try(module.secrets[0].secret_names, [])
}

output "api_listener_https_port" {
  description = "443 when the HTTPS listener is planned. 0 when enable_api_listener_tls is false (ADR 0077)."
  value       = try(module.api_listener[0].https_port, 0)
}

output "api_listener_cleartext_forward" {
  description = "False when the module is on: port 80 redirects. Null when the module is off."
  value       = try(module.api_listener[0].cleartext_forward, null)
}

output "api_listener_http_redirect_status" {
  description = "HTTP_301 when the redirect listener is planned. Empty otherwise."
  value       = try(module.api_listener[0].http_redirect_status, "")
}

output "waf_web_acl_arn" {
  description = "Regional API WAF ACL ARN. Plan refuses to apply unless waf_associate_alb_arn is the API ALB (ADR 0074)."
  value       = try(module.waf[0].web_acl_arn, "")
}

output "k8s_wiring_hint" {
  description = "Operator reminder after a successful apply."
  value       = <<-EOT
    After apply:
    1. Populate Secrets Manager shells (computerpets/LICENSE_SECRET_KEY, …) out of band.
    2. Apply deploy/k8s/external-secret.example.yaml (copy with real secretStoreRef).
    3. Point ConfigMap SPRING_DATASOURCE_URL / REDIS_HOST at the outputs above; drop in-cluster postgres/redis Deployments.
    4. Set BUNDLE_BASE_URL to bundle_base_url output.
    5. Set waf_associate_alb_arn to the API ALB before apply (ADR 0074). Health check path is /actuator/health or /actuator/health/liveness.
    6. If redis_auth_enabled is true, set REDIS_SSL=true and REDIS_AUTH_REQUIRED=true and inject REDIS_PASSWORD (or REDIS_PASSWORD_FILE) from the same token. Do not put the token in the ConfigMap or in git. If it is false, leave those unset.
    7. Set POSTGRES_SSL_REQUIRED=true with spring_datasource_url. That URL is sslmode=require unless postgres_ssl_root_cert was set (then verify-full). Mount that PEM and set POSTGRES_SSL_ROOT_CERT to the same path. Do not invent a CA bundle. In-cluster Postgres leaves the flag unset.
    8. Keep verifying GHCR digests (ADR 0061) before kubectl set image.
    9. For a public API door, set api_listener_alb_arn (same value as waf_associate_alb_arn), api_listener_certificate_arn (an ACM certificate you already have — this root does not call ACM), and api_listener_target_group_arn. Port 80 redirects to 443. Then set API_LISTENER_TLS_REQUIRED=true and API_PUBLIC_BASE_URL=https://<your host>. Leave both unset for in-cluster HTTP. Do not set server.ssl (ADR 0077).
  EOT
}

output "networking_ready" {
  description = "True when vpc_id and private_subnet_ids are set (Postgres/Redis will provision)."
  value       = local.networking_ready
}

output "spring_datasource_url" {
  description = "Value for ConfigMap SPRING_DATASOURCE_URL when Postgres is provisioned."
  value       = try(module.postgres[0].jdbc_url, "")
}

output "redis_host" {
  description = "Value for ConfigMap REDIS_HOST when Redis is provisioned."
  value       = try(module.redis[0].primary_endpoint, "")
}

output "redis_port" {
  value = "6379"
}

output "bundle_base_url" {
  description = "Suggested BUNDLE_BASE_URL when CDN is provisioned."
  value       = try(module.cdn[0].bundle_base_url, "")
}

output "house_secret_names" {
  description = "Secrets Manager names matching External Secrets remoteRef keys."
  value       = try(module.secrets[0].secret_names, [])
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
    6. Keep verifying GHCR digests (ADR 0061) before kubectl set image.
  EOT
}

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

output "node_pool_zone_count" {
  description = "Number of API node groups planned, one per availability zone (ADR 0082). 0 when enable_node_pool is false or the map is not ready."
  value       = try(module.node_pool[0].node_group_count, 0)
}

output "node_pool_availability_zones" {
  description = "Availability zones that will receive a private API worker. Empty until the plan gate passes."
  value       = try(module.node_pool[0].availability_zones, [])
}

output "node_pool_public_nodes" {
  description = "Always false. Workers do not take a public IP (ADR 0082)."
  value       = try(module.node_pool[0].public_nodes, false)
}

output "node_pool_ssh_ingress" {
  description = "closed. The node group has no remote_access block and no SSH key (ADR 0082)."
  value       = try(module.node_pool[0].ssh_ingress, "closed")
}

output "node_pool_max_size_per_zone" {
  description = "Max workers in one zone's node group. At least the HPA ceiling (ADR 0083). 0 when the pool is off."
  value       = try(module.node_pool[0].max_size_per_zone, 0)
}

output "node_pool_desired_size_owner" {
  description = "cluster-autoscaler. Terraform ignores desired_size after create (ADR 0083)."
  value       = try(module.node_pool[0].desired_size_owner, "")
}

output "node_pool_autoscaler_tag_count" {
  description = "Auto Scaling group discovery tags. Two per planned zone. 0 when the pool is off."
  value       = try(module.node_pool[0].cluster_autoscaler_asg_tag_count, 0)
}

output "cluster_autoscaler_attached" {
  description = "True when the Cluster Autoscaler IRSA role is planned (ADR 0083)."
  value       = try(module.cluster_autoscaler[0].attached, false)
}

output "cluster_autoscaler_role_arn" {
  description = "Annotate kube-system/cluster-autoscaler with this ARN. Empty when the role is not planned. Do not commit a real account id."
  value       = try(module.cluster_autoscaler[0].role_arn, "")
}

output "cluster_autoscaler_role_name" {
  value = try(module.cluster_autoscaler[0].role_name, "")
}

output "system_daemon_toleration_recorded" {
  description = "True when vpc-cni configuration_values and the kube-proxy patch both record the API pool toleration (ADR 0096). False when enable_node_pool is false."
  value       = try(module.system_daemons[0].recorded, false)
}

output "kube_proxy_hook_recorded" {
  description = "True when the kube-proxy reassert hook is recorded (ADR 0097). False when enable_node_pool is false."
  value       = try(module.system_daemons[0].kube_proxy_hook_recorded, false)
}

output "kube_proxy_reassert_enabled" {
  description = "True only when reassert_kube_proxy_toleration is true and the cluster name is set (ADR 0097)."
  value       = try(module.system_daemons[0].kube_proxy_reassert_enabled, false)
}

output "vpc_cni_addon_planned" {
  description = "True when the vpc-cni addon is planned (ADR 0096). False for an empty cluster name and for kind or minikube."
  value       = try(module.system_daemons[0].addon_planned, false)
}

output "node_pool_zone_label" {
  description = "topology.kubernetes.io/zone. EKS sets it from the instance AZ. This root does not stamp it."
  value       = try(module.node_pool[0].zone_label, "topology.kubernetes.io/zone")
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
    10. For multi-AZ API workers, set eks_cluster_name and node_pool_subnets to at least two private subnets in aws_region (ADR 0082). One on-demand node group per zone. No public IP. No SSH. This root does not create the cluster. Set enable_node_pool=false for kind or minikube. EKS sets topology.kubernetes.io/zone from the instance AZ. Import an existing vpc-cni addon (ADR 0096). Set reassert_kube_proxy_toleration=true so plan probes kube-proxy and apply reasserts coverage (ADR 0097). Leave that flag false for CI, kind, and minikube. Do not taint a kind or minikube node.
    11. Cluster Autoscaler (ADR 0083, ADR 0099) grows those groups when pods are Pending. Set eks_oidc_provider_arn to the cluster's existing OIDC provider (this root does not create it). Each group's max is 20 (ADR 0104). The HPA ceiling is 6 (ADR 0107). Terraform ignores desired_size after create. Apply deploy/k8s/cluster-autoscaler.yaml only after substituting CLUSTER_NAME, AWS_REGION, and the role ARN. Zone spread is DoNotSchedule on topology.kubernetes.io/zone (maxSkew 1). One labeled zone still schedules. Do not set minDomains. It is not in the kustomization. enable_node_pool=false keeps the role off for kind or minikube and does not set a zone label.
  EOT
}

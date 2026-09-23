# ComputerPets managed stores — Terraform root (ARCHITECTURE deployment gap).
#
# Inventory (main tip after #1430 / ADR 0061):
#   deploy/k8s/          — app + in-cluster Postgres/Redis scaffolding
#   external-secret…     — ESO contract for computerpets-secrets
#   (no deploy/terraform prior to this slice)
#
# This root wires Postgres, Redis, secret shells, CDN, the regional API
# WAF (ADR 0074), and the API HTTPS listener (ADR 0077). Deny-safe defaults:
# no public DBs, no house crypto in tfvars/state, WAF plan refuses an empty
# ALB ARN, listener plan refuses a missing ACM certificate. This root does
# not call ACM. AWS is the reference provider; keepers may fork.

locals {
  networking_ready = var.vpc_id != "" && length(var.private_subnet_ids) > 0
}

module "postgres" {
  count  = var.enable_postgres ? 1 : 0
  source = "./modules/postgres"

  project_name        = var.project_name
  environment         = var.environment
  vpc_id              = var.vpc_id
  private_subnet_ids  = var.private_subnet_ids
  app_cidr_blocks     = var.app_cidr_blocks
  publicly_accessible = var.postgres_publicly_accessible
  engine_version      = var.postgres_engine_version
  instance_class      = var.postgres_instance_class
  db_name             = var.postgres_db_name
  username            = var.postgres_username
  ssl_root_cert       = var.postgres_ssl_root_cert
}

module "redis" {
  count  = var.enable_redis ? 1 : 0
  source = "./modules/redis"

  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = var.vpc_id
  private_subnet_ids = var.private_subnet_ids
  app_cidr_blocks    = var.app_cidr_blocks
  node_type          = var.redis_node_type
  engine_version     = var.redis_engine_version
  auth_token         = var.redis_auth_token
}

module "secrets" {
  count  = var.enable_secrets ? 1 : 0
  source = "./modules/secrets"

  project_name              = var.project_name
  environment               = var.environment
  write_house_secret_values = var.write_house_secret_values
}

module "cdn" {
  count  = var.enable_cdn ? 1 : 0
  source = "./modules/cdn"

  project_name = var.project_name
  environment  = var.environment
  price_class  = var.cdn_price_class
}

module "waf" {
  count  = var.enable_waf ? 1 : 0
  source = "./modules/waf"

  project_name      = var.project_name
  environment       = var.environment
  associate_alb_arn = var.waf_associate_alb_arn
}

module "api_listener" {
  count  = var.enable_api_listener_tls ? 1 : 0
  source = "./modules/api_listener"

  project_name     = var.project_name
  environment      = var.environment
  alb_arn          = var.api_listener_alb_arn
  certificate_arn  = var.api_listener_certificate_arn
  target_group_arn = var.api_listener_target_group_arn
}

# Plan-time gate the test suite can name. The module association carries the
# same precondition; this root object fails the plan when enable_waf is on
# and the ARN is missing or is not an application load balancer.
resource "terraform_data" "waf_association_gate" {
  input = var.waf_associate_alb_arn

  lifecycle {
    precondition {
      condition = (
        !var.enable_waf ||
        (
          length(var.waf_associate_alb_arn) > 0 &&
          startswith(var.waf_associate_alb_arn, "arn:aws:elasticloadbalancing:") &&
          strcontains(var.waf_associate_alb_arn, ":loadbalancer/app/")
        )
      )
      error_message = "WAF association is fail-closed (ADR 0074). Set waf_associate_alb_arn to the API application load balancer ARN (arn:aws:elasticloadbalancing:…:loadbalancer/app/…). An unassociated ACL is not in front of the rate limiter. Set enable_waf=false only when you intentionally have no edge gate."
    }
  }
}

# Plan-time gate for the public API listener (ADR 0077). The module also
# refuses a bad ARN shape. This root object adds the WAF pairing: the HTTPS
# listener and the WAF must name the same keeper-owned ALB. This root does
# not create an ACM certificate and does not create the load balancer.
resource "terraform_data" "api_listener_tls_gate" {
  input = {
    enabled = var.enable_api_listener_tls
    alb     = var.api_listener_alb_arn
    waf_alb = var.waf_associate_alb_arn
    cert    = var.api_listener_certificate_arn
    tg      = var.api_listener_target_group_arn
  }

  lifecycle {
    precondition {
      condition = (
        !var.enable_api_listener_tls ||
        (
          length(var.api_listener_alb_arn) > 0 &&
          startswith(var.api_listener_alb_arn, "arn:aws:elasticloadbalancing:") &&
          strcontains(var.api_listener_alb_arn, ":loadbalancer/app/") &&
          startswith(var.api_listener_certificate_arn, "arn:aws:acm:") &&
          strcontains(var.api_listener_certificate_arn, ":certificate/") &&
          startswith(var.api_listener_target_group_arn, "arn:aws:elasticloadbalancing:") &&
          strcontains(var.api_listener_target_group_arn, ":targetgroup/") &&
          (
            !var.enable_waf ||
            var.api_listener_alb_arn == var.waf_associate_alb_arn
          )
        )
      )
      error_message = "API listener TLS is fail-closed (ADR 0077). Set api_listener_alb_arn to the keeper-owned API ALB, api_listener_certificate_arn to an existing ACM certificate ARN, and api_listener_target_group_arn to that ALB's target group. This root does not create an ACM certificate and does not create the ALB. Port 80 redirects to 443. When enable_waf is true the listener ALB must be waf_associate_alb_arn. Set enable_api_listener_tls=false only when you intentionally have no public TLS listener (local or in-cluster HTTP)."
    }
  }
}

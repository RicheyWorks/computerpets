# ComputerPets managed stores — Terraform root (ARCHITECTURE deployment gap).
#
# Inventory (main tip after #1430 / ADR 0061):
#   deploy/k8s/          — app + in-cluster Postgres/Redis scaffolding
#   external-secret…     — ESO contract for computerpets-secrets
#   (no deploy/terraform prior to this slice)
#
# This root wires Postgres, Redis, secret shells, CDN, and WAF stubs that match
# what the house already expects. Deny-safe defaults: no public DBs, no house
# crypto in tfvars/state. AWS is the reference provider; keepers may fork.

locals {
  networking_ready = var.vpc_id != "" && length(var.private_subnet_ids) > 0
}

module "postgres" {
  count  = var.enable_postgres ? 1 : 0
  source = "./modules/postgres"

  project_name         = var.project_name
  environment          = var.environment
  vpc_id               = var.vpc_id
  private_subnet_ids   = var.private_subnet_ids
  app_cidr_blocks      = var.app_cidr_blocks
  publicly_accessible  = var.postgres_publicly_accessible
  engine_version       = var.postgres_engine_version
  instance_class       = var.postgres_instance_class
  db_name              = var.postgres_db_name
  username             = var.postgres_username
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
}

module "secrets" {
  count  = var.enable_secrets ? 1 : 0
  source = "./modules/secrets"

  project_name               = var.project_name
  environment                = var.environment
  write_house_secret_values  = var.write_house_secret_values
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

  project_name       = var.project_name
  environment        = var.environment
  rate_limit         = var.waf_rate_limit
  associate_alb_arn  = var.waf_associate_alb_arn
}

variable "project_name" {
  type        = string
  description = "Short name used in resource names and tags."
  default     = "computerpets"
}

variable "environment" {
  type        = string
  description = "Deployment environment label (staging|prod)."
  default     = "prod"

  validation {
    condition     = contains(["staging", "prod"], var.environment)
    error_message = "environment must be staging or prod."
  }
}

variable "aws_region" {
  type        = string
  description = "AWS region for managed stores. Reference cloud only — keepers may fork modules for GCP/Azure."
  default     = "us-east-1"
}

variable "extra_tags" {
  type        = map(string)
  description = "Optional extra tags merged onto every tagged resource."
  default     = {}
}

variable "vpc_id" {
  type        = string
  description = "Existing VPC id. Required for a real apply; leave empty only for validate/docs dry-runs."
  default     = ""
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "Private subnet ids for Postgres and Redis. Empty default is deny-safe (no public DB placement)."
  default     = []
}

variable "app_cidr_blocks" {
  type        = list(string)
  description = "CIDR blocks allowed to reach Postgres/Redis (typically private app/pod networks). Empty = no ingress rules (deny-all until set)."
  default     = []
}

variable "enable_postgres" {
  type        = bool
  description = "Provision the managed Postgres module."
  default     = true
}

variable "enable_redis" {
  type        = bool
  description = "Provision the managed Redis module."
  default     = true
}

variable "enable_secrets" {
  type        = bool
  description = "Create Secrets Manager shells matching External Secrets remoteRef keys."
  default     = true
}

variable "enable_cdn" {
  type        = bool
  description = "Provision private object storage + CDN stub for pet bundles."
  default     = true
}

variable "enable_waf" {
  type        = bool
  description = "Provision a WAF web ACL stub (association is optional)."
  default     = true
}

variable "postgres_publicly_accessible" {
  type        = bool
  description = "DENY-SAFE DEFAULT false. Do not flip true for production."
  default     = false

  validation {
    condition     = var.postgres_publicly_accessible == false
    error_message = "postgres_publicly_accessible must be false — public managed Postgres is not an accepted ComputerPets production shape."
  }
}

variable "postgres_engine_version" {
  type        = string
  description = "RDS Postgres engine version (16.x matches deploy/k8s/postgres.yaml)."
  default     = "16.4"
}

variable "postgres_instance_class" {
  type        = string
  description = "RDS instance class."
  default     = "db.t4g.micro"
}

variable "postgres_db_name" {
  type        = string
  description = "Initial database name (matches POSTGRES_DB / computerpets)."
  default     = "computerpets"
}

variable "postgres_username" {
  type        = string
  description = "Master username (not a password). Password is AWS-managed when provisioned."
  default     = "computerpets"
  sensitive   = false
}

variable "redis_node_type" {
  type        = string
  description = "ElastiCache node type."
  default     = "cache.t4g.micro"
}

variable "redis_engine_version" {
  type        = string
  description = "Redis engine version (7.x matches deploy/k8s/redis.yaml)."
  default     = "7.1"
}

variable "cdn_price_class" {
  type        = string
  description = "CloudFront price class for the bundle CDN stub."
  default     = "PriceClass_100"
}

variable "waf_rate_limit" {
  type        = number
  description = "WAF rate-based rule threshold (requests per 5 minutes per IP)."
  default     = 2000
}

variable "waf_associate_alb_arn" {
  type        = string
  description = "Optional ALB ARN to associate the WAF ACL. Empty = ACL only (no association)."
  default     = ""
}

variable "write_house_secret_values" {
  type        = bool
  description = "NEVER enable for normal applies. When true, Terraform would write secret versions (state risk). Default false: shells only."
  default     = false

  validation {
    condition     = var.write_house_secret_values == false
    error_message = "write_house_secret_values must stay false — house crypto keys must not be placed in Terraform state. Populate Secrets Manager / Vault out of band for External Secrets."
  }
}

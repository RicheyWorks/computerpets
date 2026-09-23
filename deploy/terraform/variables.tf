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
  description = "Provision the regional API WAF. Plan/apply refuses to continue unless waf_associate_alb_arn is the API ALB (ADR 0074). Set false only when you intentionally have no edge gate."
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

variable "postgres_ssl_root_cert" {
  type        = string
  description = "Optional path on the app host to the RDS CA bundle (ADR 0076). Empty jdbc_url uses sslmode=require and the parameter group sets rds.force_ssl=1. A path switches the JDBC URL to sslmode=verify-full. Not a secret. Do not commit a bundle."
  default     = ""

  validation {
    condition = (
      var.postgres_ssl_root_cert == "" ||
      (
        can(regex("^/[A-Za-z0-9._/-]+$", var.postgres_ssl_root_cert)) &&
        !strcontains(var.postgres_ssl_root_cert, "..") &&
        !strcontains(var.postgres_ssl_root_cert, "//")
      )
    )
    error_message = "postgres_ssl_root_cert must be empty or an absolute local path (no '..', space, query, or URL). Do not invent a CA bundle."
  }
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

variable "redis_auth_token" {
  type        = string
  description = "ElastiCache AUTH token (ADR 0075). Empty keeps the AUTH-less cache cluster used by compose and in-cluster redis.yaml. Non-empty enables AUTH and transit encryption on a single-node replication group. Pass as TF_VAR_redis_auth_token. Never commit the token. It is stored in Terraform state because ElastiCache requires it at create — use an encrypted backend."
  default     = ""
  sensitive   = true

  validation {
    condition = (
      var.redis_auth_token == "" ||
      (
        length(var.redis_auth_token) >= 16 &&
        length(var.redis_auth_token) <= 128 &&
        can(regex("^[!-~]+$", var.redis_auth_token)) &&
        !strcontains(var.redis_auth_token, "@") &&
        !strcontains(var.redis_auth_token, "\"") &&
        !strcontains(var.redis_auth_token, "/")
      )
    )
    error_message = "redis_auth_token must be empty or 16-128 printable ASCII characters excluding space, @, \", and / (ElastiCache AUTH rules). Do not commit the token."
  }
}

variable "cdn_price_class" {
  type        = string
  description = "CloudFront price class for the bundle CDN stub."
  default     = "PriceClass_100"
}

variable "waf_associate_alb_arn" {
  type        = string
  description = "API application load balancer ARN. Required for plan/apply when enable_waf is true (ADR 0074). Empty is accepted by terraform validate only; plan refuses it."
  default     = ""

  validation {
    condition = (
      var.waf_associate_alb_arn == "" ||
      (
        startswith(var.waf_associate_alb_arn, "arn:aws:elasticloadbalancing:") &&
        strcontains(var.waf_associate_alb_arn, ":loadbalancer/app/")
      )
    )
    error_message = "waf_associate_alb_arn must be empty (validate-only) or an application load balancer ARN (arn:aws:elasticloadbalancing:…:loadbalancer/app/…)."
  }
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

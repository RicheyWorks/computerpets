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

variable "enable_api_listener_tls" {
  type        = bool
  description = "Attach an HTTPS listener and an HTTP-to-HTTPS redirect on the keeper-owned API ALB (ADR 0077). Plan/apply refuses to continue unless the ALB, an existing ACM certificate ARN, and the target group ARN are set. This root does not create an ACM certificate. Set false only for local or in-cluster HTTP with no public listener."
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

variable "api_listener_alb_arn" {
  type        = string
  description = "Keeper-owned API application load balancer ARN for the HTTPS listener (ADR 0077). Required for plan/apply when enable_api_listener_tls is true. When enable_waf is also true this must equal waf_associate_alb_arn. Empty is accepted by terraform validate only. This root does not create the ALB."
  default     = ""

  validation {
    condition = (
      var.api_listener_alb_arn == "" ||
      (
        startswith(var.api_listener_alb_arn, "arn:aws:elasticloadbalancing:") &&
        strcontains(var.api_listener_alb_arn, ":loadbalancer/app/")
      )
    )
    error_message = "api_listener_alb_arn must be empty (validate-only) or an application load balancer ARN (arn:aws:elasticloadbalancing:…:loadbalancer/app/…)."
  }
}

variable "api_listener_certificate_arn" {
  type        = string
  description = "Existing ACM certificate ARN for the API listener (ADR 0077). Required for plan/apply when enable_api_listener_tls is true. Empty is accepted by terraform validate only. This root does not call ACM and does not invent a domain."
  default     = ""

  validation {
    condition = (
      var.api_listener_certificate_arn == "" ||
      (
        startswith(var.api_listener_certificate_arn, "arn:aws:acm:") &&
        strcontains(var.api_listener_certificate_arn, ":certificate/")
      )
    )
    error_message = "api_listener_certificate_arn must be empty (validate-only) or an ACM certificate ARN (arn:aws:acm:…:certificate/…)."
  }
}

variable "api_listener_target_group_arn" {
  type        = string
  description = "Existing target group ARN on the API ALB. The HTTPS listener forwards here. The pods stay HTTP on 8081 (ADR 0077). Empty is accepted by terraform validate only."
  default     = ""

  validation {
    condition = (
      var.api_listener_target_group_arn == "" ||
      (
        startswith(var.api_listener_target_group_arn, "arn:aws:elasticloadbalancing:") &&
        strcontains(var.api_listener_target_group_arn, ":targetgroup/")
      )
    )
    error_message = "api_listener_target_group_arn must be empty (validate-only) or a target group ARN (arn:aws:elasticloadbalancing:…:targetgroup/…)."
  }
}

variable "reassert_kube_proxy_toleration" {
  type        = bool
  description = "Probe DaemonSet kube-proxy on plan and reassert API pool coverage on apply when it drifted (ADR 0097). Default false so CI, terraform test, kind, and minikube do not call kubectl. Set true only with an EKS kubeconfig. A kind or minikube context fails the plan. Do not taint a kind or minikube node."
  default     = false
}

variable "enable_node_pool" {
  type        = bool
  description = "Provision one private EKS managed node group per availability zone (ADR 0082). Plan/apply refuses to continue unless eks_cluster_name is set and node_pool_subnets has at least two private subnets in aws_region. This root does not create the cluster. Set false only for local kind/minikube, where this root should not create workers."
  default     = true
}

variable "eks_cluster_name" {
  type        = string
  description = "Keeper-owned EKS cluster name for the API node groups (ADR 0082). Required for plan/apply when enable_node_pool is true. Empty is accepted by terraform validate only. This root does not create the cluster."
  default     = ""

  validation {
    condition = (
      var.eks_cluster_name == "" ||
      can(regex("^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$", var.eks_cluster_name))
    )
    error_message = "eks_cluster_name must be empty (validate-only) or an EKS cluster name (letters, digits, hyphen, underscore)."
  }
}

variable "node_pool_subnets" {
  type        = map(string)
  description = "Private subnet id per availability zone for the API node groups (ADR 0082). Keys are AZ names in aws_region (us-east-1a). At least two zones. Values are distinct subnet ids. Empty is accepted by terraform validate only. This root does not create subnets."
  default     = {}

  validation {
    condition = (
      length(var.node_pool_subnets) == 0 ||
      (
        length(var.node_pool_subnets) >= 2 &&
        length(distinct(values(var.node_pool_subnets))) == length(var.node_pool_subnets) &&
        alltrue([
          for az, subnet in var.node_pool_subnets :
          can(regex("^[a-z]{2}-[a-z]+-[0-9][a-z]$", az)) &&
          can(regex("^subnet-([0-9a-f]{8}|[0-9a-f]{17})$", subnet))
        ])
      )
    )
    error_message = "node_pool_subnets must be empty (validate-only) or at least two distinct private subnet ids keyed by availability zone (us-east-1a = \"subnet-\" plus 8 or 17 hex characters)."
  }
}

variable "enable_cluster_autoscaler" {
  type        = bool
  description = "Plan the Cluster Autoscaler IRSA role for the API node groups (ADR 0083). Requires enable_node_pool and eks_oidc_provider_arn. Kind/minikube set enable_node_pool=false, which skips this role even when the flag stays true. Set false only when those groups must not be scaled by this role."
  default     = true
}

variable "eks_oidc_provider_arn" {
  type        = string
  description = "Keeper-owned EKS OIDC provider ARN for Cluster Autoscaler IRSA (ADR 0083). Required for plan/apply when enable_node_pool and enable_cluster_autoscaler are both true. Empty is accepted by terraform validate only. This root does not create the provider. The issuer host must be oidc.eks.<aws_region>.amazonaws.com."
  default     = ""

  validation {
    condition = (
      var.eks_oidc_provider_arn == "" ||
      can(regex(
        "^arn:aws:iam::[0-9]{12}:oidc-provider/oidc\\.eks\\.[a-z0-9-]+\\.amazonaws\\.com/id/[A-Z0-9]{32}$",
        var.eks_oidc_provider_arn
      ))
    )
    error_message = "eks_oidc_provider_arn must be empty (validate-only) or an EKS OIDC provider ARN (arn:aws:iam::ACCOUNT:oidc-provider/oidc.eks.<region>.amazonaws.com/id/<32 chars>)."
  }
}

variable "node_pool_instance_types" {
  type        = list(string)
  description = "Instance types for each zone's node group (ADR 0082). Default t3.medium. GPU, Inferentia, Trainium, and VT families are refused."
  default     = ["t3.medium"]

  validation {
    condition = (
      length(var.node_pool_instance_types) >= 1 &&
      length(var.node_pool_instance_types) <= 4 &&
      alltrue([
        for t in var.node_pool_instance_types :
        can(regex("^[a-z][0-9][a-z]?\\.(nano|micro|small|medium|large|xlarge|[0-9]+xlarge|metal)$", t)) &&
        !can(regex("^(p|g|vt|dl|inf|trn)", t))
      ])
    )
    error_message = "node_pool_instance_types must be 1-4 general-purpose sizes (for example t3.medium). GPU, Inferentia, Trainium, and VT families are refused."
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

variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "app_cidr_blocks" {
  type = list(string)
}

variable "node_type" {
  type = string
}

variable "engine_version" {
  type = string
}

# Empty keeps the AUTH-less cache cluster (compose / in-cluster redis.yaml).
# Non-empty creates a replication group with AUTH + transit encryption.
# ElastiCache accepts AUTH only when transit encryption is on, and only on a
# replication group — aws_elasticache_cluster has no auth_token.
variable "auth_token" {
  type        = string
  default     = ""
  sensitive   = true
  description = "ElastiCache AUTH token. Empty = no AUTH and no transit TLS (ADR 0075)."

  validation {
    condition = (
      var.auth_token == "" ||
      (
        length(var.auth_token) >= 16 &&
        length(var.auth_token) <= 128 &&
        can(regex("^[!-~]+$", var.auth_token)) &&
        !strcontains(var.auth_token, "@") &&
        !strcontains(var.auth_token, "\"") &&
        !strcontains(var.auth_token, "/")
      )
    )
    error_message = "auth_token must be empty or 16-128 printable ASCII characters excluding space, @, \", and / (ElastiCache AUTH rules, ADR 0075)."
  }
}

locals {
  name         = "${var.project_name}-${var.environment}-redis"
  provision    = var.vpc_id != "" && length(var.private_subnet_ids) > 0
  # The boolean does not reveal the token. nonsensitive keeps plan output usable.
  auth_enabled = nonsensitive(var.auth_token != "")
}

resource "aws_security_group" "redis" {
  count = local.provision ? 1 : 0

  name        = "${local.name}-sg"
  description = "ComputerPets managed Redis — private only"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow outbound."
  }

  tags = {
    Name = "${local.name}-sg"
  }
}

resource "aws_security_group_rule" "redis_ingress" {
  for_each = local.provision ? toset(var.app_cidr_blocks) : toset([])

  type              = "ingress"
  security_group_id = aws_security_group.redis[0].id
  from_port         = 6379
  to_port           = 6379
  protocol          = "tcp"
  cidr_blocks       = [each.value]
  description       = "App / pod CIDR to Redis"
}

resource "aws_elasticache_subnet_group" "redis" {
  count = local.provision ? 1 : 0

  name       = "${local.name}-subnets"
  subnet_ids = var.private_subnet_ids
}

# redis-auth ADR 0075: empty token → cache cluster, no AUTH, no transit TLS.
# Do not add auth_token here. The cluster API cannot set it.
resource "aws_elasticache_cluster" "redis" {
  count = local.provision && !local.auth_enabled ? 1 : 0

  cluster_id           = local.name
  engine               = "redis"
  engine_version       = var.engine_version
  node_type            = var.node_type
  num_cache_nodes      = 1
  port                 = 6379
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.redis[0].name
  security_group_ids   = [aws_security_group.redis[0].id]

  tags = {
    Name = local.name
  }
}

# redis-auth ADR 0075: non-empty token → replication group with AUTH and
# transit encryption. One primary, no replica. Failover stays off.
resource "aws_elasticache_replication_group" "redis" {
  count = local.provision && local.auth_enabled ? 1 : 0

  replication_group_id       = local.name
  description                = "ComputerPets Redis with AUTH and transit encryption"
  engine                     = "redis"
  engine_version             = var.engine_version
  node_type                  = var.node_type
  num_cache_clusters         = 1
  port                       = 6379
  parameter_group_name       = "default.redis7"
  subnet_group_name          = aws_elasticache_subnet_group.redis[0].name
  security_group_ids         = [aws_security_group.redis[0].id]
  automatic_failover_enabled = false
  multi_az_enabled           = false
  transit_encryption_enabled = true
  at_rest_encryption_enabled = true
  auth_token                 = var.auth_token

  tags = {
    Name = local.name
  }

  lifecycle {
    precondition {
      condition     = var.auth_token != "" && length(var.auth_token) >= 16
      error_message = "Redis AUTH replication group requires a 16+ character token and transit encryption (ADR 0075). An empty token uses the AUTH-less cache cluster."
    }
  }
}

# Plan-time gate the test suite can name. Variable validation already refuses
# a short token; this object repeats the length rule so a half-configured
# node cannot slip through if that validation is edited away.
resource "terraform_data" "redis_auth_shape" {
  input = local.auth_enabled ? "auth-tls" : "open"

  lifecycle {
    precondition {
      condition = (
        var.auth_token == "" ||
        (length(var.auth_token) >= 16 && length(var.auth_token) <= 128)
      )
      error_message = "Redis AUTH is fail-closed (ADR 0075). Leave redis_auth_token empty for the AUTH-less cache cluster, or set a 16-128 character token. A short token does not enable a half-configured node."
    }
  }
}

output "provisioned" {
  value = local.provision
}

output "auth_enabled" {
  description = "True when this node was created with AUTH. The token is not an output."
  value       = local.provision && local.auth_enabled
}

output "transit_encryption_enabled" {
  description = "True when clients must use TLS (REDIS_SSL=true). Paired with AUTH."
  value = (
    local.provision && local.auth_enabled
    ? aws_elasticache_replication_group.redis[0].transit_encryption_enabled
    : false
  )
}

output "primary_endpoint" {
  description = "REDIS_HOST for ConfigMap overlay."
  value = local.provision ? (
    local.auth_enabled
    ? try(aws_elasticache_replication_group.redis[0].primary_endpoint_address, "")
    : try(aws_elasticache_cluster.redis[0].cache_nodes[0].address, "")
  ) : ""
}

output "port" {
  value = 6379
}

output "security_group_id" {
  value = local.provision ? aws_security_group.redis[0].id : ""
}

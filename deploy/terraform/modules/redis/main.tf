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

locals {
  name      = "${var.project_name}-${var.environment}-redis"
  provision = var.vpc_id != "" && length(var.private_subnet_ids) > 0
}

resource "aws_security_group" "redis" {
  count = local.provision ? 1 : 0

  name        = "${local.name}-sg"
  description = "ComputerPets managed Redis — private only; app has no Redis AUTH setting"
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

# AUTH / transit TLS stay off: RateLimitConfiguration only reads REDIS_HOST /
# REDIS_PORT / REDIS_TIMEOUT. Do not invent a password the app cannot use.
# Network isolation is the deny-safe control until the app grows Redis TLS.
resource "aws_elasticache_cluster" "redis" {
  count = local.provision ? 1 : 0

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

output "provisioned" {
  value = local.provision
}

output "primary_endpoint" {
  description = "REDIS_HOST for ConfigMap overlay."
  value       = local.provision ? aws_elasticache_cluster.redis[0].cache_nodes[0].address : ""
}

output "port" {
  value = 6379
}

output "security_group_id" {
  value = local.provision ? aws_security_group.redis[0].id : ""
}

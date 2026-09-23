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

variable "publicly_accessible" {
  type    = bool
  default = false
}

variable "engine_version" {
  type = string
}

variable "instance_class" {
  type = string
}

variable "db_name" {
  type = string
}

variable "username" {
  type = string
}

# Empty jdbc_url uses sslmode=require. A local CA bundle path uses
# sslmode=verify-full. This is not a secret and is not an RDS setting.
variable "ssl_root_cert" {
  type        = string
  default     = ""
  description = "Optional app-host path to the RDS CA bundle. Empty = sslmode=require. Non-empty = sslmode=verify-full (ADR 0076)."

  validation {
    condition = (
      var.ssl_root_cert == "" ||
      (
        can(regex("^/[A-Za-z0-9._/-]+$", var.ssl_root_cert)) &&
        !strcontains(var.ssl_root_cert, "..") &&
        !strcontains(var.ssl_root_cert, "//")
      )
    )
    error_message = "ssl_root_cert must be empty or an absolute local path (no '..', space, query, or URL). Do not invent a CA bundle (ADR 0076)."
  }
}

locals {
  name = "${var.project_name}-${var.environment}-pg"
  # Plan-friendly: skip AWS resources until networking is named.
  provision     = var.vpc_id != "" && length(var.private_subnet_ids) > 0
  engine_major  = regex("^([0-9]+)", var.engine_version)[0]
  ssl_root_cert = trimspace(var.ssl_root_cert)
  # require encrypts without checking the server certificate. verify-full
  # checks the CA and the hostname when the operator mounted a bundle.
  sslmode = local.ssl_root_cert == "" ? "require" : "verify-full"
  jdbc_query = (
    local.sslmode == "require"
    ? "sslmode=require"
    : "sslmode=verify-full&sslrootcert=${local.ssl_root_cert}"
  )
}

resource "aws_security_group" "postgres" {
  count = local.provision ? 1 : 0

  name        = "${local.name}-sg"
  description = "ComputerPets managed Postgres — deny public by default"
  vpc_id      = var.vpc_id

  # No egress invented beyond what RDS needs; keepers may tighten further.
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow outbound (RDS patching / CloudWatch)."
  }

  tags = {
    Name = "${local.name}-sg"
  }
}

resource "aws_security_group_rule" "postgres_ingress" {
  for_each = local.provision ? toset(var.app_cidr_blocks) : toset([])

  type              = "ingress"
  security_group_id = aws_security_group.postgres[0].id
  from_port         = 5432
  to_port           = 5432
  protocol          = "tcp"
  cidr_blocks       = [each.value]
  description       = "App / pod CIDR to Postgres"
}

resource "aws_db_subnet_group" "postgres" {
  count = local.provision ? 1 : 0

  name       = "${local.name}-subnets"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "${local.name}-subnets"
  }
}

# postgres-tls ADR 0076: every provisioned instance forces SSL.
# rds.force_ssl is dynamic on RDS PostgreSQL; immediate does not by itself
# schedule a reboot. First attach of this group to an existing instance can.
resource "aws_db_parameter_group" "postgres" {
  count = local.provision ? 1 : 0

  name        = "${local.name}-params"
  family      = "postgres${local.engine_major}"
  description = "ComputerPets RDS Postgres — rds.force_ssl=1 (ADR 0076)"

  parameter {
    name         = "rds.force_ssl"
    value        = "1"
    apply_method = "immediate"
  }

  tags = {
    Name = "${local.name}-params"
  }
}

resource "aws_db_instance" "postgres" {
  count = local.provision ? 1 : 0

  identifier     = local.name
  engine         = "postgres"
  engine_version = var.engine_version
  instance_class = var.instance_class

  db_name  = var.db_name
  username = var.username

  # AWS stores the master password in Secrets Manager — not a TF variable.
  manage_master_user_password = true

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_type          = "gp3"
  storage_encrypted     = true

  db_subnet_group_name   = aws_db_subnet_group.postgres[0].name
  vpc_security_group_ids = [aws_security_group.postgres[0].id]
  parameter_group_name   = aws_db_parameter_group.postgres[0].name
  publicly_accessible    = var.publicly_accessible
  multi_az               = var.environment == "prod"

  backup_retention_period = var.environment == "prod" ? 7 : 1
  deletion_protection     = var.environment == "prod"
  skip_final_snapshot     = var.environment != "prod"
  final_snapshot_identifier = var.environment == "prod" ? "${local.name}-final" : null

  auto_minor_version_upgrade = true
  copy_tags_to_snapshot      = true

  # Deny-safe: no public snapshot share invented here.
  tags = {
    Name = local.name
  }

  lifecycle {
    precondition {
      condition     = var.publicly_accessible == false
      error_message = "postgres publicly_accessible must be false (deny-safe). Public RDS is not an accepted ComputerPets production shape."
    }
  }
}

# Plan-time gate. require and verify-full are the only managed modes.
# A CA path without verify-full, or verify-full without a path, cannot plan.
resource "terraform_data" "postgres_transit_tls" {
  input = local.sslmode

  lifecycle {
    precondition {
      condition = (
        (local.ssl_root_cert == "" && local.sslmode == "require") ||
        (local.ssl_root_cert != "" && local.sslmode == "verify-full")
      )
      error_message = "Postgres transit TLS is fail-closed (ADR 0076). An empty CA path uses sslmode=require. A CA path uses sslmode=verify-full. A mixed pair is refused."
    }
  }
}

output "provisioned" {
  value = local.provision
}

output "endpoint" {
  description = "RDS hostname (empty when networking not yet named)."
  value       = local.provision ? aws_db_instance.postgres[0].address : ""
}

output "port" {
  value = 5432
}

output "db_name" {
  value = var.db_name
}

output "username" {
  value = var.username
}

output "jdbc_url" {
  description = "SPRING_DATASOURCE_URL shape for ConfigMap overlay. Includes sslmode (ADR 0076)."
  value = local.provision ? format(
    "jdbc:postgresql://%s:5432/%s?%s",
    aws_db_instance.postgres[0].address,
    var.db_name,
    local.jdbc_query,
  ) : ""
}

output "sslmode" {
  description = "JDBC sslmode baked into jdbc_url when provisioned. require, or verify-full when a CA path is set."
  value       = local.provision ? local.sslmode : ""
}

output "jdbc_query" {
  description = "Query string appended to jdbc_url. Known at plan time (no hostname)."
  value       = local.jdbc_query
}

output "force_ssl" {
  description = "True when the parameter group sets rds.force_ssl=1."
  value       = local.provision
}

output "master_user_secret_arn" {
  description = "AWS-managed master password secret ARN (not house crypto keys)."
  value       = local.provision ? aws_db_instance.postgres[0].master_user_secret[0].secret_arn : ""
  sensitive   = true
}

output "security_group_id" {
  value = local.provision ? aws_security_group.postgres[0].id : ""
}

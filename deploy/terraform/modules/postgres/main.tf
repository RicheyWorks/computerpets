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

locals {
  name = "${var.project_name}-${var.environment}-pg"
  # Plan-friendly: skip AWS resources until networking is named.
  provision = var.vpc_id != "" && length(var.private_subnet_ids) > 0
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
  description = "SPRING_DATASOURCE_URL shape for ConfigMap overlay."
  value = local.provision ? format(
    "jdbc:postgresql://%s:5432/%s",
    aws_db_instance.postgres[0].address,
    var.db_name,
  ) : ""
}

output "master_user_secret_arn" {
  description = "AWS-managed master password secret ARN (not house crypto keys)."
  value       = local.provision ? aws_db_instance.postgres[0].master_user_secret[0].secret_arn : ""
  sensitive   = true
}

output "security_group_id" {
  value = local.provision ? aws_security_group.postgres[0].id : ""
}

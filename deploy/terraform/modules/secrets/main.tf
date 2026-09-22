variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "write_house_secret_values" {
  type    = bool
  default = false
}

locals {
  # Paths match deploy/k8s/external-secret.example.yaml remoteRef keys.
  house_secret_keys = [
    "LICENSE_SECRET_KEY",
    "JWT_SECRET_KEY",
    "BUNDLE_SIGNING_KEY",
    "ADMIN_API_KEY",
    "SPRING_DATASOURCE_USERNAME",
    "SPRING_DATASOURCE_PASSWORD",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_DB",
  ]
}

# Shells only. Values are populated out of band (CLI / console / Vault)
# so house crypto never enters Terraform state as plaintext tfvars.
resource "aws_secretsmanager_secret" "house" {
  for_each = toset(local.house_secret_keys)

  name                    = "computerpets/${each.key}"
  description             = "ComputerPets house secret shell for External Secrets (${each.key}). Populate out of band — do not put values in *.tfvars."
  recovery_window_in_days = 7

  tags = {
    Name              = "computerpets/${each.key}"
    ExternalSecretKey = each.key
    Contract          = "deploy/k8s/external-secret.example.yaml"
  }
}

# Hard refuse: even if a future editor removes the root validation, this
# module must not create secret versions from Terraform variables.
resource "terraform_data" "refuse_plaintext_values" {
  lifecycle {
    precondition {
      condition     = var.write_house_secret_values == false
      error_message = "Refusing to write house secret values from Terraform. Use aws secretsmanager put-secret-value (or Vault) then External Secrets."
    }
  }
}

output "secret_arns" {
  description = "Map of house key → Secrets Manager ARN (names only; no secret payloads)."
  value       = { for k, s in aws_secretsmanager_secret.house : k => s.arn }
}

output "secret_names" {
  description = "remoteRef.key values for External Secrets Operator."
  value       = [for k in local.house_secret_keys : "computerpets/${k}"]
}

output "external_secrets_contract" {
  description = "Pointer to the k8s CR that syncs these shells into computerpets-secrets."
  value       = "deploy/k8s/external-secret.example.yaml"
}

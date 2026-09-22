terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0, < 6.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.5, < 4.0"
    }
  }

  # Keepers choose the backend (S3 + DynamoDB lock, Terraform Cloud, etc.).
  # This repo does not invent a live state bucket.
  # backend "s3" {}
}

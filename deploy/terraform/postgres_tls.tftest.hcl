# ADR 0076 — plan-time proof that managed Postgres forces SSL.
# mock_provider keeps this off the network. CI and local verify do not apply.
# The CA path is a fixture filesystem path, not a bundled certificate.

mock_provider "aws" {}

variables {
  enable_postgres = true
  enable_redis    = false
  enable_secrets  = false
  enable_cdn      = false
  enable_waf      = false
  vpc_id          = "vpc-0123456789abcdef0"
  private_subnet_ids = ["subnet-aaa", "subnet-bbb"]
  app_cidr_blocks    = ["10.0.0.0/16"]
}

run "provisioned_rds_forces_ssl" {
  command = plan

  variables {
    postgres_ssl_root_cert = ""
  }

  assert {
    condition     = module.postgres[0].provisioned == true
    error_message = "Named VPC and subnets should provision Postgres."
  }

  assert {
    condition     = module.postgres[0].force_ssl == true
    error_message = "Provisioned RDS must set rds.force_ssl=1."
  }

  assert {
    condition     = module.postgres[0].sslmode == "require"
    error_message = "An empty CA path must use sslmode=require."
  }

  assert {
    condition     = module.postgres[0].jdbc_query == "sslmode=require"
    error_message = "jdbc_url query must be sslmode=require."
  }
}

run "ca_path_uses_verify_full" {
  command = plan

  variables {
    postgres_ssl_root_cert = "/etc/ssl/rds-ca.pem"
  }

  assert {
    condition     = module.postgres[0].force_ssl == true
    error_message = "A CA path still forces SSL on the server."
  }

  assert {
    condition     = module.postgres[0].sslmode == "verify-full"
    error_message = "A CA path must use sslmode=verify-full."
  }

  assert {
    condition     = module.postgres[0].jdbc_query == "sslmode=verify-full&sslrootcert=/etc/ssl/rds-ca.pem"
    error_message = "jdbc_url query must name sslmode=verify-full and the same CA path."
  }
}

run "ca_path_with_query_is_refused" {
  command = plan

  variables {
    postgres_ssl_root_cert = "/tmp/ca.pem?x=1"
  }

  expect_failures = [
    var.postgres_ssl_root_cert,
  ]
}

run "ca_path_with_parent_dir_is_refused" {
  command = plan

  variables {
    postgres_ssl_root_cert = "/tmp/../ca.pem"
  }

  expect_failures = [
    var.postgres_ssl_root_cert,
  ]
}

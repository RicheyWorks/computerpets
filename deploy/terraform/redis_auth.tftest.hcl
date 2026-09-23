# ADR 0075 — plan-time proof that Redis AUTH and transit TLS are paired.
# mock_provider keeps this off the network. CI and local verify do not apply.
# The fixture token is not a production secret.

mock_provider "aws" {}

variables {
  enable_postgres = false
  enable_redis    = true
  enable_secrets  = false
  enable_cdn      = false
  enable_waf      = false
  vpc_id          = "vpc-0123456789abcdef0"
  private_subnet_ids = ["subnet-aaa", "subnet-bbb"]
  app_cidr_blocks    = ["10.0.0.0/16"]
}

run "empty_token_stays_authless" {
  command = plan

  variables {
    redis_auth_token = ""
  }

  assert {
    condition     = module.redis[0].auth_enabled == false
    error_message = "Empty redis_auth_token must stay AUTH-less."
  }

  assert {
    condition     = module.redis[0].transit_encryption_enabled == false
    error_message = "Empty redis_auth_token must not enable transit TLS."
  }

  assert {
    condition     = module.redis[0].provisioned == true
    error_message = "Named VPC and subnets should still provision Redis."
  }
}

run "short_token_is_refused" {
  command = plan

  variables {
    redis_auth_token = "short-token"
  }

  expect_failures = [
    var.redis_auth_token,
  ]
}

run "token_with_slash_is_refused" {
  command = plan

  variables {
    redis_auth_token = "abcdefghijklmnop/q"
  }

  expect_failures = [
    var.redis_auth_token,
  ]
}

run "token_enables_auth_and_transit_tls" {
  command = plan

  variables {
    redis_auth_token = "plan-fixture-token"
  }

  assert {
    condition     = module.redis[0].auth_enabled == true
    error_message = "A supplied token must enable AUTH."
  }

  assert {
    condition     = module.redis[0].transit_encryption_enabled == true
    error_message = "A supplied token must enable transit TLS."
  }
}

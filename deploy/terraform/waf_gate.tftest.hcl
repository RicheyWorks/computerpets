# ADR 0074 — plan-time proof that the WAF association fails closed.
# mock_provider keeps this off the network. CI and local verify do not apply.

mock_provider "aws" {}

variables {
  enable_postgres         = false
  enable_redis            = false
  enable_secrets          = false
  enable_cdn              = false
  enable_waf              = true
  enable_api_listener_tls = false
  enable_node_pool        = false
}

run "empty_alb_arn_is_refused" {
  command = plan

  variables {
    waf_associate_alb_arn = ""
  }

  expect_failures = [
    terraform_data.waf_association_gate,
  ]
}

run "network_load_balancer_arn_is_refused" {
  command = plan

  variables {
    waf_associate_alb_arn = "arn:aws:elasticloadbalancing:us-east-1:000000000000:loadbalancer/net/computerpets/example"
  }

  expect_failures = [
    var.waf_associate_alb_arn,
  ]
}

run "application_load_balancer_arn_plans" {
  command = plan

  variables {
    waf_associate_alb_arn = "arn:aws:elasticloadbalancing:us-east-1:000000000000:loadbalancer/app/computerpets/example"
  }

  assert {
    condition     = module.waf[0].associated == true
    error_message = "WAF module should report the ALB association as required."
  }
}

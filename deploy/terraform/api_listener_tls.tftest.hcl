# ADR 0077 — plan-time proof that the public API listener fails closed.
# mock_provider keeps this off the network. CI and local verify do not apply.
# The certificate ARN is a fixture. This test does not call ACM.

mock_provider "aws" {}

variables {
  enable_postgres         = false
  enable_redis            = false
  enable_secrets          = false
  enable_cdn              = false
  enable_waf              = false
  enable_api_listener_tls = true
}

run "empty_certificate_arn_is_refused" {
  command = plan

  variables {
    api_listener_alb_arn          = "arn:aws:elasticloadbalancing:us-east-1:000000000000:loadbalancer/app/computerpets/example"
    api_listener_certificate_arn  = ""
    api_listener_target_group_arn = "arn:aws:elasticloadbalancing:us-east-1:000000000000:targetgroup/computerpets/example"
  }

  expect_failures = [
    terraform_data.api_listener_tls_gate,
  ]
}

run "non_acm_certificate_arn_is_refused" {
  command = plan

  variables {
    api_listener_alb_arn          = "arn:aws:elasticloadbalancing:us-east-1:000000000000:loadbalancer/app/computerpets/example"
    api_listener_certificate_arn  = "arn:aws:iam::000000000000:certificate/example"
    api_listener_target_group_arn = "arn:aws:elasticloadbalancing:us-east-1:000000000000:targetgroup/computerpets/example"
  }

  expect_failures = [
    var.api_listener_certificate_arn,
  ]
}

run "network_load_balancer_arn_is_refused" {
  command = plan

  variables {
    api_listener_alb_arn          = "arn:aws:elasticloadbalancing:us-east-1:000000000000:loadbalancer/net/computerpets/example"
    api_listener_certificate_arn  = "arn:aws:acm:us-east-1:000000000000:certificate/11111111-2222-3333-4444-555555555555"
    api_listener_target_group_arn = "arn:aws:elasticloadbalancing:us-east-1:000000000000:targetgroup/computerpets/example"
  }

  expect_failures = [
    var.api_listener_alb_arn,
  ]
}

run "https_listener_plans_on_the_keeper_alb" {
  command = plan

  variables {
    api_listener_alb_arn          = "arn:aws:elasticloadbalancing:us-east-1:000000000000:loadbalancer/app/computerpets/example"
    api_listener_certificate_arn  = "arn:aws:acm:us-east-1:000000000000:certificate/11111111-2222-3333-4444-555555555555"
    api_listener_target_group_arn = "arn:aws:elasticloadbalancing:us-east-1:000000000000:targetgroup/computerpets/example"
  }

  assert {
    condition     = module.api_listener[0].attached == true
    error_message = "A shaped ACM ARN should plan the HTTPS listener."
  }

  assert {
    condition     = module.api_listener[0].https_port == 443
    error_message = "The public listener must be port 443."
  }

  assert {
    condition     = module.api_listener[0].cleartext_forward == false
    error_message = "Port 80 must not forward cleartext."
  }

  assert {
    condition     = module.api_listener[0].http_redirect_status == "HTTP_301"
    error_message = "Port 80 must redirect with HTTP 301."
  }

  assert {
    condition     = module.api_listener[0].ssl_policy == "ELBSecurityPolicy-TLS13-1-2-2021-06"
    error_message = "The HTTPS listener must use the TLS 1.3 policy."
  }
}

run "listener_alb_must_match_the_waf_alb" {
  command = plan

  variables {
    enable_waf                    = true
    waf_associate_alb_arn         = "arn:aws:elasticloadbalancing:us-east-1:000000000000:loadbalancer/app/computerpets/waf"
    api_listener_alb_arn          = "arn:aws:elasticloadbalancing:us-east-1:000000000000:loadbalancer/app/computerpets/other"
    api_listener_certificate_arn  = "arn:aws:acm:us-east-1:000000000000:certificate/11111111-2222-3333-4444-555555555555"
    api_listener_target_group_arn = "arn:aws:elasticloadbalancing:us-east-1:000000000000:targetgroup/computerpets/example"
  }

  expect_failures = [
    terraform_data.api_listener_tls_gate,
  ]
}

run "same_alb_as_the_waf_plans" {
  command = plan

  variables {
    enable_waf                    = true
    waf_associate_alb_arn         = "arn:aws:elasticloadbalancing:us-east-1:000000000000:loadbalancer/app/computerpets/example"
    api_listener_alb_arn          = "arn:aws:elasticloadbalancing:us-east-1:000000000000:loadbalancer/app/computerpets/example"
    api_listener_certificate_arn  = "arn:aws:acm:us-east-1:000000000000:certificate/11111111-2222-3333-4444-555555555555"
    api_listener_target_group_arn = "arn:aws:elasticloadbalancing:us-east-1:000000000000:targetgroup/computerpets/example"
  }

  assert {
    condition     = module.api_listener[0].attached == true
    error_message = "The HTTPS listener and the WAF must plan on the same ALB."
  }

  assert {
    condition     = module.waf[0].associated == true
    error_message = "The WAF association stays on that same ALB."
  }
}

run "disabled_module_stays_http" {
  command = plan

  variables {
    enable_api_listener_tls = false
  }

  assert {
    condition     = output.api_listener_https_port == 0
    error_message = "enable_api_listener_tls=false must not plan an HTTPS listener."
  }

  assert {
    condition     = output.api_listener_cleartext_forward == null
    error_message = "A disabled module does not claim a redirect."
  }
}

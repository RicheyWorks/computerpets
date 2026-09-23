variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "associate_alb_arn" {
  type    = string
  default = ""
}

locals {
  name       = "${var.project_name}-${var.environment}-api"
  window_sec = 60

  # Contract markers. check-waf-gate.sh and WafRateLimitGateContractTest
  # require these lines to match RateLimitingFilter.RULES (one-minute window).
  # Do not tune the numbers here. They are the JVM buckets, not a second knob.
  # waf-bucket verify prefix=/api/verify/ limit=10 window_sec=60
  # waf-bucket download prefix=/api/download/ limit=30 window_sec=60
  # waf-bucket discovery prefix=/api/pets limit=60 window_sec=60
  # waf-bucket bundles prefix=/api/bundles/ limit=60 window_sec=60
  verify_prefix    = "/api/verify/"
  verify_limit     = 10
  download_prefix  = "/api/download/"
  download_limit   = 30
  discovery_prefix = "/api/pets"
  discovery_limit  = 60
  bundles_prefix   = "/api/bundles/"
  bundles_limit    = 60
  # Same shape as RateLimitingFilter.isSignedBundleRedeem: one pet segment, then redeem.
  redeem_regex = "^/api/bundles/[^/]+/redeem/?$"
  # House doors that may reach the JVM after the rate rules. Unknown paths stay blocked.
  # waf-allow-regex=^/(api/(verify|download|pets|bundles|admin|public)(/.*)?|pet/(feed|play|rest)|actuator/health(/.*)?)$
  allow_regex = "^/(api/(verify|download|pets|bundles|admin|public)(/.*)?|pet/(feed|play|rest)|actuator/health(/.*)?)$"
}

# Regional WAF in front of the JVM rate limiter (ADR 0074).
# Default action is block. The four rate rules match RateLimitingFilter
# buckets on a 60-second window and answer 429. Signed bundle redeem is
# not on the bundles rule. Association to the API ALB is unconditional (no count).
# Root terraform_data.waf_association_gate fails plan when the ARN is empty or not an ALB.
# This ACL is not attached to the bundle CloudFront distribution.
resource "aws_wafv2_web_acl" "api" {
  name        = local.name
  description = "ComputerPets API WAF — fail-closed rate limits in front of the JVM buckets"
  scope       = "REGIONAL"

  default_action {
    block {}
  }

  custom_response_body {
    key          = "rate-limited"
    content_type = "APPLICATION_JSON"
    content      = "{\"type\":\"about:blank\",\"title\":\"Too Many Requests\",\"status\":429,\"detail\":\"WAF rate limit exceeded.\"}"
  }

  rule {
    name     = "verify"
    priority = 10

    action {
      block {
        custom_response {
          response_code            = 429
          custom_response_body_key = "rate-limited"
          response_header {
            name  = "Retry-After"
            value = "60"
          }
        }
      }
    }

    statement {
      rate_based_statement {
        limit                 = local.verify_limit
        evaluation_window_sec = local.window_sec
        aggregate_key_type    = "IP"

        scope_down_statement {
          byte_match_statement {
            positional_constraint = "STARTS_WITH"
            search_string         = local.verify_prefix
            field_to_match {
              uri_path {}
            }
            text_transformation {
              priority = 0
              type     = "NONE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-verify"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "download"
    priority = 20

    action {
      block {
        custom_response {
          response_code            = 429
          custom_response_body_key = "rate-limited"
          response_header {
            name  = "Retry-After"
            value = "60"
          }
        }
      }
    }

    statement {
      rate_based_statement {
        limit                 = local.download_limit
        evaluation_window_sec = local.window_sec
        aggregate_key_type    = "IP"

        scope_down_statement {
          byte_match_statement {
            positional_constraint = "STARTS_WITH"
            search_string         = local.download_prefix
            field_to_match {
              uri_path {}
            }
            text_transformation {
              priority = 0
              type     = "NONE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-download"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "discovery"
    priority = 30

    action {
      block {
        custom_response {
          response_code            = 429
          custom_response_body_key = "rate-limited"
          response_header {
            name  = "Retry-After"
            value = "60"
          }
        }
      }
    }

    statement {
      rate_based_statement {
        limit                 = local.discovery_limit
        evaluation_window_sec = local.window_sec
        aggregate_key_type    = "IP"

        scope_down_statement {
          byte_match_statement {
            positional_constraint = "STARTS_WITH"
            search_string         = local.discovery_prefix
            field_to_match {
              uri_path {}
            }
            text_transformation {
              priority = 0
              type     = "NONE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-discovery"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "bundles"
    priority = 40

    action {
      block {
        custom_response {
          response_code            = 429
          custom_response_body_key = "rate-limited"
          response_header {
            name  = "Retry-After"
            value = "60"
          }
        }
      }
    }

    statement {
      rate_based_statement {
        limit                 = local.bundles_limit
        evaluation_window_sec = local.window_sec
        aggregate_key_type    = "IP"

        scope_down_statement {
          and_statement {
            statement {
              byte_match_statement {
                positional_constraint = "STARTS_WITH"
                search_string         = local.bundles_prefix
                field_to_match {
                  uri_path {}
                }
                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }
            statement {
              not_statement {
                statement {
                  regex_match_statement {
                    regex_string = local.redeem_regex
                    field_to_match {
                      uri_path {}
                    }
                    text_transformation {
                      priority = 0
                      type     = "NONE"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-bundles"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "aws-common"
    priority = 50

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-common"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "allow-house"
    priority = 60

    action {
      allow {}
    }

    statement {
      regex_match_statement {
        regex_string = local.allow_regex
        field_to_match {
          uri_path {}
        }
        text_transformation {
          priority = 0
          type     = "NONE"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-allow"
      sampled_requests_enabled   = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = local.name
    sampled_requests_enabled   = false
  }

  tags = {
    Name = local.name
  }
}

# Unconditional. An empty ARN does not skip this resource. The root
# terraform_data.waf_association_gate fails the plan until the ARN is an ALB.
resource "aws_wafv2_web_acl_association" "alb" {
  resource_arn = var.associate_alb_arn
  web_acl_arn  = aws_wafv2_web_acl.api.arn
}

output "web_acl_arn" {
  value = aws_wafv2_web_acl.api.arn
}

output "web_acl_id" {
  value = aws_wafv2_web_acl.api.id
}

output "associated" {
  description = "True when this module is on. Plan refuses an empty or non-ALB ARN."
  value       = true
}

variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "rate_limit" {
  type = number
}

variable "associate_alb_arn" {
  type    = string
  default = ""
}

locals {
  name = "${var.project_name}-${var.environment}-api"
}

# Stub WAF ACL for the house API (verify / download). Association is
# optional — keepers pass waf_associate_alb_arn when an ALB exists.
# This does not invent Cloudflare or a live account.
resource "aws_wafv2_web_acl" "api" {
  name        = local.name
  description = "ComputerPets API WAF stub — rate limit + common bad inputs"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "rate-limit"
    priority = 1

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = var.rate_limit
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${local.name}-rate"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "aws-common"
    priority = 2

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
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = local.name
    sampled_requests_enabled   = true
  }

  tags = {
    Name = local.name
  }
}

resource "aws_wafv2_web_acl_association" "alb" {
  count = var.associate_alb_arn != "" ? 1 : 0

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
  value = var.associate_alb_arn != ""
}

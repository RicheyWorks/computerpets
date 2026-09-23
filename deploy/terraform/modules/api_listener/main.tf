variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "alb_arn" {
  type = string
}

variable "certificate_arn" {
  type = string
}

variable "target_group_arn" {
  type = string
}

locals {
  name = "${var.project_name}-${var.environment}-api"
  # api-listener ADR 0077
  # cleartext-forward=false
  # http-action=redirect
  # http-status=HTTP_301
  # https-port=443
  # ssl-policy=ELBSecurityPolicy-TLS13-1-2-2021-06
  https_port = 443
  http_port  = 80
  ssl_policy = "ELBSecurityPolicy-TLS13-1-2-2021-06"

  # Listeners are planned only when the ARNs are shaped. An empty set does
  # not get a provider error, and it does not become a quiet HTTP forward.
  # The root terraform_data.api_listener_tls_gate fails the plan until the
  # shape is ready. This module does not create an ACM certificate or an ALB.
  ready = (
    startswith(var.alb_arn, "arn:aws:elasticloadbalancing:") &&
    strcontains(var.alb_arn, ":loadbalancer/app/") &&
    startswith(var.certificate_arn, "arn:aws:acm:") &&
    strcontains(var.certificate_arn, ":certificate/") &&
    startswith(var.target_group_arn, "arn:aws:elasticloadbalancing:") &&
    strcontains(var.target_group_arn, ":targetgroup/")
  )
}

resource "aws_lb_listener" "https" {
  count             = local.ready ? 1 : 0
  load_balancer_arn = var.alb_arn
  port              = local.https_port
  protocol          = "HTTPS"
  ssl_policy        = local.ssl_policy
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = var.target_group_arn
  }

  tags = {
    Name = "${local.name}-https"
  }
}

resource "aws_lb_listener" "http_redirect" {
  count             = local.ready ? 1 : 0
  load_balancer_arn = var.alb_arn
  port              = local.http_port
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  tags = {
    Name = "${local.name}-http-redirect"
  }
}

output "https_port" {
  value = local.ready ? local.https_port : 0
}

output "http_redirect_status" {
  description = "HTTP_301 when the listener is planned. Empty when the ARN shape is not ready."
  value       = local.ready ? "HTTP_301" : ""
}

output "ssl_policy" {
  value = local.ssl_policy
}

output "cleartext_forward" {
  description = "Always false. Port 80 redirects. This module never forwards cleartext."
  value       = false
}

output "attached" {
  description = "True when the HTTPS listener and the HTTP redirect are both planned."
  value       = local.ready
}

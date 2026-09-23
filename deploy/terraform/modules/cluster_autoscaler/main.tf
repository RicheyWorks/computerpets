variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "oidc_provider_arn" {
  type = string
}

locals {
  name = "${var.project_name}-${var.environment}-cluster-autoscaler"
  # cluster-autoscaler ADR 0083
  # scaler=cluster-autoscaler
  # not-karpenter=true
  # desired-size-owner=cluster-autoscaler
  # irsa-only=true
  # service-account=system:serviceaccount:kube-system:cluster-autoscaler
  # local-kind=off
  # This module does not create an EKS cluster, an OIDC provider, a VPC,
  # a subnet, or a node group. It does not grant the worker node role.
  issuer_host = "oidc.eks.${var.aws_region}.amazonaws.com"
  # Shape uses escaped dots. The region check is a literal substring so a
  # dot in aws_region is not a regex wildcard.
  oidc_shape_ok = can(regex(
    "^arn:aws:iam::[0-9]{12}:oidc-provider/oidc\\.eks\\.[a-z0-9-]+\\.amazonaws\\.com/id/[A-Z0-9]{32}$",
    var.oidc_provider_arn
  ))
  oidc_region_ok = strcontains(
    var.oidc_provider_arn,
    ":oidc-provider/${local.issuer_host}/id/"
  )
  oidc_ok    = local.oidc_shape_ok && local.oidc_region_ok
  cluster_ok = can(regex("^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$", var.cluster_name))
  ready      = local.oidc_ok && local.cluster_ok
  issuer_path = local.oidc_ok ? split("oidc-provider/", var.oidc_provider_arn)[1] : ""
  service_account = "system:serviceaccount:kube-system:cluster-autoscaler"

  describe_actions = [
    "autoscaling:DescribeAutoScalingGroups",
    "autoscaling:DescribeAutoScalingInstances",
    "autoscaling:DescribeLaunchConfigurations",
    "autoscaling:DescribeScalingActivities",
    "ec2:DescribeImages",
    "ec2:DescribeInstanceTypes",
    "ec2:DescribeLaunchTemplateVersions",
    "ec2:GetInstanceTypesFromInstanceRequirements",
    "eks:DescribeNodegroup",
  ]

  scale_actions = [
    "autoscaling:SetDesiredCapacity",
    "autoscaling:TerminateInstanceInAutoScalingGroup",
  ]

  # Never granted, and denied so a later broader Allow cannot open them.
  denied_actions = [
    "autoscaling:CreateAutoScalingGroup",
    "autoscaling:DeleteAutoScalingGroup",
    "autoscaling:UpdateAutoScalingGroup",
    "ec2:AssociateAddress",
    "ec2:RunInstances",
    "ec2:AuthorizeSecurityGroupIngress",
    "ec2:CreateKeyPair",
    "iam:CreateUser",
    "iam:CreateAccessKey",
    "iam:AttachUserPolicy",
    "iam:PassRole",
    "eks:CreateCluster",
    "eks:DeleteNodegroup",
    "eks:UpdateNodegroupConfig",
  ]

  trust_json = local.ready ? jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = "sts:AssumeRoleWithWebIdentity"
      Principal = {
        Federated = var.oidc_provider_arn
      }
      Condition = {
        StringEquals = {
          "${local.issuer_path}:aud" = "sts.amazonaws.com"
          "${local.issuer_path}:sub" = local.service_account
        }
      }
    }]
  }) : ""

  policy_json = local.ready ? jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "DescribeOnly"
        Effect   = "Allow"
        Action   = local.describe_actions
        Resource = "*"
      },
      {
        Sid      = "ScaleTaggedGroups"
        Effect   = "Allow"
        Action   = local.scale_actions
        Resource = "*"
        Condition = {
          StringEquals = {
            "autoscaling:ResourceTag/k8s.io/cluster-autoscaler/enabled"             = "true"
            "autoscaling:ResourceTag/k8s.io/cluster-autoscaler/${var.cluster_name}" = "owned"
          }
        }
      },
      {
        Sid      = "DenyScaleWhenEnabledTagMissing"
        Effect   = "Deny"
        Action   = local.scale_actions
        Resource = "*"
        Condition = {
          Null = {
            "autoscaling:ResourceTag/k8s.io/cluster-autoscaler/enabled" = "true"
          }
        }
      },
      {
        Sid      = "DenyScaleWhenEnabledTagWrong"
        Effect   = "Deny"
        Action   = local.scale_actions
        Resource = "*"
        Condition = {
          StringNotEquals = {
            "autoscaling:ResourceTag/k8s.io/cluster-autoscaler/enabled" = "true"
          }
        }
      },
      {
        Sid      = "DenyScaleWhenClusterTagMissing"
        Effect   = "Deny"
        Action   = local.scale_actions
        Resource = "*"
        Condition = {
          Null = {
            "autoscaling:ResourceTag/k8s.io/cluster-autoscaler/${var.cluster_name}" = "true"
          }
        }
      },
      {
        Sid      = "DenyScaleWhenClusterTagWrong"
        Effect   = "Deny"
        Action   = local.scale_actions
        Resource = "*"
        Condition = {
          StringNotEquals = {
            "autoscaling:ResourceTag/k8s.io/cluster-autoscaler/${var.cluster_name}" = "owned"
          }
        }
      },
      {
        Sid      = "DenyUntaggedPower"
        Effect   = "Deny"
        Action   = local.denied_actions
        Resource = "*"
      },
    ]
  }) : ""
}

resource "aws_iam_role" "this" {
  count = local.ready ? 1 : 0
  name  = local.name

  assume_role_policy = local.trust_json
}

resource "aws_iam_role_policy" "this" {
  count = local.ready ? 1 : 0
  name  = local.name
  role  = aws_iam_role.this[0].id

  policy = local.policy_json
}

output "attached" {
  description = "True when the IRSA role for Cluster Autoscaler is planned."
  value       = local.ready
}

output "role_name" {
  value = local.ready ? local.name : ""
}

output "role_arn" {
  value = try(aws_iam_role.this[0].arn, "")
}

output "service_account" {
  value = local.service_account
}

output "policy_json" {
  description = "Inline policy. Empty until the OIDC issuer and cluster name are ready."
  value       = local.policy_json
}

output "trust_json" {
  description = "Assume-role policy. Web identity only. Empty until ready."
  value       = local.trust_json
}

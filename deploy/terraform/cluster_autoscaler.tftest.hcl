# ADR 0083 — plan-time proof for Cluster Autoscaler on the multi-AZ node groups.
# mock_provider keeps this off the network. CI and local verify do not apply.
# The OIDC ARN, cluster name, and subnet ids are fixtures.

mock_provider "aws" {}

variables {
  enable_postgres            = false
  enable_redis               = false
  enable_secrets             = false
  enable_cdn                 = false
  enable_waf                 = false
  enable_api_listener_tls    = false
  enable_node_pool           = true
  enable_cluster_autoscaler  = true
}

run "empty_oidc_is_refused" {
  command = plan

  variables {
    eks_cluster_name = "computerpets"
    node_pool_subnets = {
      "us-east-1a" = "subnet-0123456789abcdef0"
      "us-east-1b" = "subnet-0123456789abcdef1"
    }
    eks_oidc_provider_arn = ""
  }

  expect_failures = [
    terraform_data.cluster_autoscaler_gate,
  ]
}

run "malformed_oidc_is_refused" {
  command = plan

  variables {
    eks_cluster_name = "computerpets"
    node_pool_subnets = {
      "us-east-1a" = "subnet-0123456789abcdef0"
      "us-east-1b" = "subnet-0123456789abcdef1"
    }
    eks_oidc_provider_arn = "arn:aws:iam::000000000000:role/not-an-oidc-provider"
  }

  expect_failures = [
    var.eks_oidc_provider_arn,
  ]
}

run "oidc_in_another_region_is_refused" {
  command = plan

  variables {
    eks_cluster_name = "computerpets"
    node_pool_subnets = {
      "us-east-1a" = "subnet-0123456789abcdef0"
      "us-east-1b" = "subnet-0123456789abcdef1"
    }
    eks_oidc_provider_arn = "arn:aws:iam::000000000000:oidc-provider/oidc.eks.eu-west-1.amazonaws.com/id/AAAA1111BBBB2222CCCC3333DDDD4444"
  }

  expect_failures = [
    terraform_data.cluster_autoscaler_gate,
  ]
}

run "kind_path_plans_no_role" {
  command = plan

  variables {
    enable_node_pool          = false
    enable_cluster_autoscaler = true
  }

  assert {
    condition     = output.cluster_autoscaler_attached == false
    error_message = "enable_node_pool=false must not plan the autoscaler role."
  }

  assert {
    condition     = output.node_pool_zone_count == 0
    error_message = "Kind/minikube must not plan a node group."
  }

  assert {
    condition     = output.cluster_autoscaler_role_name == ""
    error_message = "Kind/minikube must not name an autoscaler role."
  }
}

run "autoscaler_off_still_tags_groups_and_ignores_desired" {
  command = plan

  variables {
    enable_cluster_autoscaler = false
    eks_cluster_name          = "computerpets"
    node_pool_subnets = {
      "us-east-1a" = "subnet-0123456789abcdef0"
      "us-east-1b" = "subnet-0123456789abcdef1"
    }
  }

  assert {
    condition     = output.cluster_autoscaler_attached == false
    error_message = "The flag off must not plan the IRSA role."
  }

  assert {
    condition     = output.node_pool_zone_count == 2
    error_message = "The node groups stay when the autoscaler role is off."
  }

  assert {
    condition     = output.node_pool_max_size_per_zone >= 10
    error_message = "Each group max stays at least the HPA ceiling."
  }

  assert {
    condition     = output.node_pool_desired_size_owner == "cluster-autoscaler"
    error_message = "desired_size stays ignored after create."
  }

  assert {
    condition     = output.node_pool_autoscaler_tag_count == 4
    error_message = "Discovery tags stay on the groups so a later role can find them."
  }
}

run "irsa_role_is_least_privilege" {
  command = plan

  variables {
    eks_cluster_name = "computerpets"
    node_pool_subnets = {
      "us-east-1a" = "subnet-0123456789abcdef0"
      "us-east-1b" = "subnet-0123456789abcdef1"
    }
    eks_oidc_provider_arn = "arn:aws:iam::000000000000:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/AAAA1111BBBB2222CCCC3333DDDD4444"
  }

  assert {
    condition     = module.cluster_autoscaler[0].attached == true
    error_message = "A ready OIDC issuer in this region should plan the role."
  }

  assert {
    condition     = module.cluster_autoscaler[0].service_account == "system:serviceaccount:kube-system:cluster-autoscaler"
    error_message = "Only the kube-system autoscaler service account may assume the role."
  }

  assert {
    condition     = module.cluster_autoscaler[0].role_name == "computerpets-prod-cluster-autoscaler"
    error_message = "The role name must match the manifest placeholder."
  }

  assert {
    condition     = output.node_pool_max_size_per_zone >= 10
    error_message = "Each Auto Scaling group max must be at least the HPA ceiling."
  }

  assert {
    condition     = output.node_pool_public_nodes == false
    error_message = "Workers stay private."
  }

  assert {
    condition = (
      strcontains(module.cluster_autoscaler[0].trust_json, "sts:AssumeRoleWithWebIdentity") &&
      strcontains(module.cluster_autoscaler[0].trust_json, "system:serviceaccount:kube-system:cluster-autoscaler") &&
      !strcontains(module.cluster_autoscaler[0].trust_json, "ec2.amazonaws.com")
    )
    error_message = "The worker node role must not be able to assume the autoscaler role."
  }

  assert {
    condition = alltrue([
      for action in [
        "ec2:AssociateAddress",
        "ec2:RunInstances",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:CreateKeyPair",
        "autoscaling:UpdateAutoScalingGroup",
        "autoscaling:CreateAutoScalingGroup",
        "iam:PassRole",
        "eks:DeleteNodegroup",
      ] :
      !contains(flatten([
        for statement in jsondecode(module.cluster_autoscaler[0].policy_json).Statement :
        statement.Effect == "Allow" ? try(tolist(statement.Action), [statement.Action]) : []
      ]), action)
    ])
    error_message = "Allow must not include public-IP, SSH-key, RunInstances, or node-group delete."
  }

  assert {
    condition = alltrue([
      for action in [
        "ec2:AssociateAddress",
        "ec2:RunInstances",
        "autoscaling:UpdateAutoScalingGroup",
        "iam:PassRole",
      ] :
      contains(flatten([
        for statement in jsondecode(module.cluster_autoscaler[0].policy_json).Statement :
        statement.Effect == "Deny" && statement.Sid == "DenyUntaggedPower" ? try(tolist(statement.Action), [statement.Action]) : []
      ]), action)
    ])
    error_message = "Those actions must be explicitly denied."
  }

  assert {
    condition = anytrue([
      for statement in jsondecode(module.cluster_autoscaler[0].policy_json).Statement :
      statement.Sid == "ScaleTaggedGroups" &&
      statement.Effect == "Allow" &&
      contains(try(tolist(statement.Action), [statement.Action]), "autoscaling:SetDesiredCapacity") &&
      try(statement.Condition.StringEquals["autoscaling:ResourceTag/k8s.io/cluster-autoscaler/enabled"], "") == "true" &&
      try(statement.Condition.StringEquals["autoscaling:ResourceTag/k8s.io/cluster-autoscaler/computerpets"], "") == "owned"
    ])
    error_message = "SetDesiredCapacity is allowed only on groups tagged for this cluster."
  }
}

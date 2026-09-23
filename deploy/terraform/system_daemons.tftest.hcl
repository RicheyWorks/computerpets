# ADR 0096 — plan-time proof that the API pool toleration is recorded
# on vpc-cni when the node pool is on, and skipped for kind/minikube.
# mock_provider keeps this off the network. CI and local verify do not apply.

mock_provider "aws" {}

variables {
  enable_postgres           = false
  enable_redis              = false
  enable_secrets            = false
  enable_cdn                = false
  enable_waf                = false
  enable_api_listener_tls   = false
  enable_node_pool          = true
  enable_cluster_autoscaler = false
}

run "two_zones_record_the_vpc_cni_toleration" {
  command = plan

  variables {
    eks_cluster_name = "computerpets"
    node_pool_subnets = {
      "us-east-1a" = "subnet-0123456789abcdef0"
      "us-east-1b" = "subnet-0123456789abcdef1"
    }
  }

  assert {
    condition     = module.system_daemons[0].recorded == true
    error_message = "The vpc-cni document and the kube-proxy patch must both record the API pool toleration."
  }

  assert {
    condition     = module.system_daemons[0].addon_planned == true
    error_message = "A named cluster plans the vpc-cni addon."
  }

  assert {
    condition     = module.system_daemons[0].kube_proxy_hook_recorded == true
    error_message = "The kube-proxy reassert hook must be recorded when the node pool is on."
  }

  assert {
    condition     = module.system_daemons[0].kube_proxy_reassert_enabled == false
    error_message = "The live kube-proxy probe stays off unless reassert_kube_proxy_toleration is true."
  }

  assert {
    condition = strcontains(
      module.system_daemons[0].vpc_cni_configuration_values,
      "computerpets/node-pool"
      ) && strcontains(
      module.system_daemons[0].vpc_cni_configuration_values,
      "Equal"
      ) && strcontains(
      module.system_daemons[0].vpc_cni_configuration_values,
      "NoSchedule"
    )
    error_message = "vpc-cni configuration_values must contain the exact API pool toleration."
  }

  assert {
    condition = !strcontains(
      module.system_daemons[0].vpc_cni_configuration_values,
      "overrideRepository"
    )
    error_message = "vpc-cni configuration_values must not fork the addon image."
  }
}

run "empty_cluster_name_does_not_plan_the_addon" {
  command = plan

  variables {
    eks_cluster_name = ""
    node_pool_subnets = {
      "us-east-1a" = "subnet-0123456789abcdef0"
      "us-east-1b" = "subnet-0123456789abcdef1"
    }
  }

  expect_failures = [
    terraform_data.node_pool_gate,
  ]
}

run "node_pool_off_skips_the_addon" {
  command = plan

  variables {
    enable_node_pool = false
  }

  assert {
    condition     = output.system_daemon_toleration_recorded == false
    error_message = "enable_node_pool=false must not record a live addon toleration."
  }

  assert {
    condition     = output.vpc_cni_addon_planned == false
    error_message = "enable_node_pool=false must not plan the vpc-cni addon."
  }

  assert {
    condition     = output.kube_proxy_reassert_enabled == false
    error_message = "enable_node_pool=false must not probe kube-proxy."
  }

  assert {
    condition     = output.kube_proxy_hook_recorded == false
    error_message = "enable_node_pool=false must not record a live kube-proxy hook."
  }
}

# ADR 0082 — plan-time proof that API workers span at least two zones.
# mock_provider keeps this off the network. CI and local verify do not apply.
# The cluster name and subnet ids are fixtures. This test does not create a cluster.

mock_provider "aws" {}

variables {
  enable_postgres         = false
  enable_redis            = false
  enable_secrets          = false
  enable_cdn              = false
  enable_waf              = false
  enable_api_listener_tls    = false
  enable_node_pool           = true
  enable_cluster_autoscaler  = false
}

run "empty_subnet_map_is_refused" {
  command = plan

  variables {
    eks_cluster_name  = "computerpets"
    node_pool_subnets = {}
  }

  expect_failures = [
    terraform_data.node_pool_gate,
  ]
}

run "empty_cluster_name_is_refused" {
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

run "one_zone_is_refused" {
  command = plan

  variables {
    eks_cluster_name = "computerpets"
    node_pool_subnets = {
      "us-east-1a" = "subnet-0123456789abcdef0"
    }
  }

  expect_failures = [
    var.node_pool_subnets,
  ]
}

run "duplicate_subnet_is_refused" {
  command = plan

  variables {
    eks_cluster_name = "computerpets"
    node_pool_subnets = {
      "us-east-1a" = "subnet-0123456789abcdef0"
      "us-east-1b" = "subnet-0123456789abcdef0"
    }
  }

  expect_failures = [
    var.node_pool_subnets,
  ]
}

run "zone_outside_the_region_is_refused" {
  command = plan

  variables {
    eks_cluster_name = "computerpets"
    node_pool_subnets = {
      "eu-west-1a" = "subnet-0123456789abcdef0"
      "eu-west-1b" = "subnet-0123456789abcdef1"
    }
  }

  expect_failures = [
    terraform_data.node_pool_gate,
  ]
}

run "gpu_instance_type_is_refused" {
  command = plan

  variables {
    eks_cluster_name         = "computerpets"
    node_pool_instance_types = ["g4dn.xlarge"]
    node_pool_subnets = {
      "us-east-1a" = "subnet-0123456789abcdef0"
      "us-east-1b" = "subnet-0123456789abcdef1"
    }
  }

  expect_failures = [
    var.node_pool_instance_types,
  ]
}

run "two_private_zones_plan" {
  command = plan

  variables {
    eks_cluster_name = "computerpets"
    node_pool_subnets = {
      "us-east-1a" = "subnet-0123456789abcdef0"
      "us-east-1b" = "subnet-0123456789abcdef1"
    }
  }

  assert {
    condition     = module.node_pool[0].attached == true
    error_message = "Two private subnets in this region should plan the node pool."
  }

  assert {
    condition     = module.node_pool[0].node_group_count == 2
    error_message = "Each availability zone gets its own node group."
  }

  assert {
    condition     = module.node_pool[0].min_size_per_zone == 1
    error_message = "Each zone keeps at least one worker."
  }

  assert {
    condition     = module.node_pool[0].public_nodes == false
    error_message = "Workers must not take a public IP."
  }

  assert {
    condition     = module.node_pool[0].ssh_ingress == "closed"
    error_message = "SSH must stay closed."
  }

  assert {
    condition     = module.node_pool[0].zone_label == "topology.kubernetes.io/zone"
    error_message = "The zone label must be the one Kubernetes already expects."
  }

  assert {
    condition     = module.node_pool[0].zone_label_source == "instance-az"
    error_message = "EKS must set the zone label from the instance AZ."
  }

  assert {
    condition     = module.node_pool[0].capacity_type == "ON_DEMAND"
    error_message = "Workers must be on-demand."
  }

  assert {
    condition     = module.node_pool[0].max_size_per_zone >= 10
    error_message = "Each node group max must be at least the HPA ceiling of 10."
  }

  assert {
    condition     = module.node_pool[0].desired_size_owner == "cluster-autoscaler"
    error_message = "Cluster Autoscaler must own desired_size after create."
  }

  assert {
    condition     = module.node_pool[0].cluster_autoscaler_asg_tag_count == 4
    error_message = "Each zone's Auto Scaling group needs the two discovery tags."
  }

  assert {
    condition = (
      contains(module.node_pool[0].availability_zones, "us-east-1a") &&
      contains(module.node_pool[0].availability_zones, "us-east-1b")
    )
    error_message = "The planned zones must be the two subnet keys."
  }
}

run "node_pool_off_plans_nothing" {
  command = plan

  variables {
    enable_node_pool = false
  }

  assert {
    condition     = output.node_pool_zone_count == 0
    error_message = "enable_node_pool=false must not plan a node group."
  }

  assert {
    condition     = output.node_pool_public_nodes == false
    error_message = "A disabled pool must not report public nodes."
  }

  assert {
    condition     = output.node_pool_ssh_ingress == "closed"
    error_message = "A disabled pool must still report SSH closed."
  }
}

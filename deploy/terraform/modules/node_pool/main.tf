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

variable "subnets" {
  type        = map(string)
  description = "Availability zone name to one private subnet id. One managed node group per entry."
}

variable "instance_types" {
  type = list(string)
}

locals {
  name = "${var.project_name}-${var.environment}-api"
  # node-pool ADR 0082
  # min-availability-zones=2
  # one-node-group-per-zone=true
  # public-nodes=false
  # ssh-ingress=closed
  # zone-label=topology.kubernetes.io/zone
  # zone-label-source=instance-az
  # capacity=ON_DEMAND
  # imds=required
  # imds-hop-limit=2
  # root-volume-encrypted=true
  # This module does not create an EKS cluster, a VPC, or a subnet.
  # It does not stamp topology.kubernetes.io/zone. EKS sets that label
  # from the instance placement AZ. One subnet per group keeps that AZ.
  # desired-size-owner=cluster-autoscaler (ADR 0083). Create uses the floor.
  # hpa-max-replicas=3. hostname-ceiling-pods=3 (ADR 0108).
  # single-zone-hostname-ceiling=3. refused-ceiling-nodes-per-pod=2.
  # One Ready zone times min_size 3, and the HPA floor. The ADR 0107
  # ceiling of 6 is 2, 2, and 2 under hostname maxSkew 1, so those
  # pods share nodes and nothing stays Pending. A ceiling of 4 or 5
  # on this floor stacks the same way. Matching min_size to a higher
  # ceiling bills two always-on nodes per extra pod: eight for 4,
  # ten for 5, twelve for 6, twenty for 10. Those bills are refused.
  # zone-max-nodes=20. ADR 0104 sized that as twice the old ceiling
  # of 10. The max stays 20. It is not twice this ceiling.
  # zone-max-floor=8. ADR 0109. One Ready zone at one pod per node is
  # maxReplicas 3, plus Cluster Autoscaler 2, plus metrics-server 2,
  # plus one drain node. Twice this ceiling is 6, which is under that
  # floor and is refused. The named pods without the drain node are 7
  # and are refused. The HPA ceiling used as a node max is 3 and is
  # refused. 20 stays above the floor. The cap is not the bill.
  # Cluster Autoscaler reads the managed Auto Scaling group's MaxSize
  # (DescribeAutoScalingGroups). It does not read this local.
  # eks:UpdateNodegroupConfig is denied, so the leader cannot lift
  # this ceiling. The live set binds on min_size 3, so desired stays
  # under MaxSize and MaxLimitReached at 20 is unreachable.
  # hpa-min-replicas=3. pdb-min-available=2. min-availability-zones=2.
  # hostname-floor-nodes=6. min-size-per-zone=3 (ADR 0106).
  # single-zone-hostname-floor=3. surviving-zones=1.
  # Hostname hard spread is maxSkew 1. Three floor pods on two hostnames
  # is 2 and 1, and that skew is legal, so the third pod binds. One Ready
  # zone therefore needs three hostnames, and those pods are 1 and 1 and 1.
  # The ADR 0105 floor of 2 is that 2-and-1 pool and is refused. A floor
  # of 4 bills a hostname the floor does not use. A third AZ with the
  # floor of 2 still leaves one Ready zone at two hostnames. Two healthy
  # zones times this floor is 6. Do not set minDomains.
  # api-pool-taint ADR 0094
  # taint-key=computerpets/node-pool
  # taint-value=api
  # taint-effect=NO_SCHEDULE
  min_size_per_zone     = 3
  desired_size_per_zone = 3
  max_size_per_zone     = 20
  root_volume_gib       = 20

  zones_ok = (
    length(var.subnets) >= 2 &&
    length(distinct(values(var.subnets))) == length(var.subnets) &&
    alltrue([
      for az, subnet in var.subnets :
      length(az) == length(var.aws_region) + 1 &&
      startswith(az, var.aws_region) &&
      can(regex("^[a-z]{2}-[a-z]+-[0-9][a-z]$", az)) &&
      can(regex("^subnet-([0-9a-f]{8}|[0-9a-f]{17})$", subnet))
    ])
  )
  cluster_ok = can(regex("^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$", var.cluster_name))
  ready      = local.zones_ok && local.cluster_ok

  # Node-group tags do not reach the managed Auto Scaling group.
  # Cluster Autoscaler discovers that group by these two tags (ADR 0083).
  ca_discovery_tags = local.cluster_ok ? {
    "k8s.io/cluster-autoscaler/enabled"             = "true"
    "k8s.io/cluster-autoscaler/${var.cluster_name}" = "owned"
  } : {}

  ca_asg_tag_pairs = local.ready ? {
    for pair in setproduct(sort(keys(var.subnets)), sort(keys(local.ca_discovery_tags))) :
    "${pair[0]}|${pair[1]}" => {
      zone = pair[0]
      key  = pair[1]
    }
  } : {}

  worker_policies = local.ready ? toset([
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
  ]) : toset([])
}

resource "aws_iam_role" "node" {
  count = local.ready ? 1 : 0
  name  = "${local.name}-node"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Action    = "sts:AssumeRole"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "worker" {
  for_each   = local.worker_policies
  role       = aws_iam_role.node[0].name
  policy_arn = each.value
}

resource "aws_launch_template" "worker" {
  count       = local.ready ? 1 : 0
  name_prefix = "${local.name}-"
  description = "Private API workers. No SSH key. No public IP. ADR 0082."

  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 2
  }

  block_device_mappings {
    device_name = "/dev/xvda"

    ebs {
      volume_size           = local.root_volume_gib
      volume_type           = "gp3"
      encrypted             = true
      delete_on_termination = true
    }
  }

  network_interfaces {
    associate_public_ip_address = false
    delete_on_termination       = true
    device_index                = 0
  }

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = "${local.name}-worker"
    }
  }
}

resource "aws_eks_node_group" "zone" {
  for_each        = local.ready ? var.subnets : {}
  cluster_name    = var.cluster_name
  node_group_name = "${local.name}-${each.key}"
  node_role_arn   = aws_iam_role.node[0].arn
  subnet_ids      = [each.value]
  instance_types  = var.instance_types
  ami_type        = "AL2023_x86_64_STANDARD"
  capacity_type   = "ON_DEMAND"

  scaling_config {
    min_size = local.min_size_per_zone
    # Create-time size only. Cluster Autoscaler owns it afterwards.
    desired_size = local.desired_size_per_zone
    max_size     = local.max_size_per_zone
  }

  # A later apply must not write desired_size back to the create-time
  # floor (ADR 0083, ADR 0106).
  # min_size and max_size stay Terraform-owned. lifecycle cannot be
  # conditional, so this ignore stays even if the autoscaler flag is off.
  lifecycle {
    ignore_changes = [scaling_config[0].desired_size]
  }

  launch_template {
    id      = aws_launch_template.worker[0].id
    version = tostring(aws_launch_template.worker[0].latest_version)
  }

  # Custom pool label only. Do not set topology.kubernetes.io/zone here.
  # A static zone label would be the same on every node in the group, and
  # it would lie if the subnet is not actually in each.key. EKS sets
  # topology.kubernetes.io/zone from the instance AZ.
  # metrics-server selects computerpets/node-pool=api (ADR 0089).
  # Cluster Autoscaler selects the same label (ADR 0091).
  # The API Deployments select the same label (ADR 0093).
  # The same key is a NoSchedule taint (ADR 0094). Kind and minikube
  # are not this resource. Do not taint a kind or minikube node.
  labels = {
    "computerpets/node-pool" = "api"
  }

  # API pool taint (ADR 0094). Untolerated pods cannot land on these
  # workers. NoSchedule does not evict pods that are already running.
  # PreferNoSchedule would still admit them. NoExecute is not set.
  # aws-node and kube-proxy toleration is ADR 0096. kube-proxy durability
  # is ADR 0097. This block does not patch those DaemonSets.
  taint {
    key    = "computerpets/node-pool"
    value  = "api"
    effect = "NO_SCHEDULE"
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [aws_iam_role_policy_attachment.worker]
}

# EKS CreateNodegroup tags stay on the node group. They are not copied
# onto the Auto Scaling group the managed node group creates. Cluster
# Autoscaler only looks at the group (ADR 0083). propagate_at_launch is
# false so the tag is not also an instance tag.
resource "aws_autoscaling_group_tag" "cluster_autoscaler" {
  for_each = local.ca_asg_tag_pairs

  autoscaling_group_name = one(one(aws_eks_node_group.zone[each.value.zone].resources).autoscaling_groups).name

  tag {
    key                 = each.value.key
    value               = local.ca_discovery_tags[each.value.key]
    propagate_at_launch = false
  }
}

output "attached" {
  description = "True when one private node group per zone is planned."
  value       = local.ready
}

output "node_group_count" {
  value = local.ready ? length(var.subnets) : 0
}

output "availability_zones" {
  value = local.ready ? sort(keys(var.subnets)) : []
}

output "min_size_per_zone" {
  value = local.min_size_per_zone
}

output "desired_size_per_zone" {
  value = local.desired_size_per_zone
}

output "max_size_per_zone" {
  value = local.max_size_per_zone
}

output "public_nodes" {
  description = "Always false. The launch template does not assign a public IP."
  value       = false
}

output "ssh_ingress" {
  description = "closed. No remote_access block and no key_name."
  value       = "closed"
}

output "zone_label" {
  description = "Label EKS sets from the instance AZ. This module does not stamp it."
  value       = "topology.kubernetes.io/zone"
}

output "zone_label_source" {
  value = "instance-az"
}

output "capacity_type" {
  value = "ON_DEMAND"
}

output "desired_size_owner" {
  description = "cluster-autoscaler. Terraform ignores desired_size after create (ADR 0083)."
  value       = "cluster-autoscaler"
}

output "cluster_autoscaler_asg_tag_count" {
  description = "Discovery tags applied to the managed Auto Scaling groups. Two per zone."
  value       = length(aws_autoscaling_group_tag.cluster_autoscaler)
}
